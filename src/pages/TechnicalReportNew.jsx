import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import IconTrash from "../assets/IconTrash.jsx";
import IconEdit from "../assets/IconEdit.jsx";
import { useTechnicalReports } from "../hooks/useTechnicalReports";
import { get } from "idb-keyval";

const TechnicalReportsNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reports, saveReportOffline, setReports } = useTechnicalReports();

    const emptyInfo = {
        customer: "",
        windfarm: "",
        wtgId: "",
        wtgType: "",
        hubHeight: "",
        repairBy: "Blades Repair Srl",
        technician: "",
        startDate: "",
        endDate: "",
        reportDate: "",
    };

    const emptyBlades = { A: [], B: [], C: [] };

    const [title, setTitle] = useState("");
    const [info, setInfo] = useState(emptyInfo);
    const [blades, setBlades] = useState(emptyBlades);

    const reportToEdit = id ? reports.find(r => r.id.toString() === id) : null;

    // --- Carica dati report e foto da IndexedDB ---
    useEffect(() => {
        if (!id || !reportToEdit) {
            setTitle("");
            setInfo(emptyInfo);
            setBlades(emptyBlades);
            return;
        }

        const loadPhotos = async () => {
            const bladesCopy = { ...reportToEdit.blades };

            for (const blade of ["A", "B", "C"]) {
                for (let i = 0; i < bladesCopy[blade].length; i++) {
                    const item = bladesCopy[blade][i];

                    console.log("Blade:", blade, "Item index:", i, "Photos array:", item.photos);

                    if (item.photos && item.photos.length > 0) {
                        const photosBase64 = await Promise.all(
                            item.photos.map(async (photo) => {
                                // Se è già base64 lo lasci, altrimenti prendi da IndexedDB
                                if (photo.startsWith("data:")) return photo;
                                const cached = await get(`photo_${photo}`);
                                return cached || null;
                            })
                        );
                        bladesCopy[blade][i].photos = photosBase64.filter(Boolean);
                    }
                }
            }

            setBlades(bladesCopy);
        };

        setTitle(reportToEdit.title || "");
        setInfo(reportToEdit.info || emptyInfo);
        loadPhotos();
    }, [id, reportToEdit]);

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleTitleChange = (e) => setTitle(e.target.value);

    const addBladeItem = (blade) => {
        setBlades(prev => ({
            ...prev,
            [blade]: [...prev[blade], { radius: "", position: "", task: "", description: "", photos: [] }]
        }));
    };

    const removeBladeItem = (blade, index) => {
        const updated = [...blades[blade]];
        updated.splice(index, 1);
        setBlades(prev => ({ ...prev, [blade]: updated }));
    };

    const handleBladeItemChange = (blade, index, field, value) => {
        const updated = [...blades[blade]];
        updated[index][field] = value;
        setBlades(prev => ({ ...prev, [blade]: updated }));
    };

    // --- Gestione Foto ---
    const handlePhotoUpload = (blade, index, files) => {
        const updated = [...blades[blade]];

        const readFiles = Array.from(files).map(file => {
            return new Promise(resolve => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readFiles).then(results => {
            updated[index].photos = [...updated[index].photos, ...results];
            setBlades(prev => ({ ...prev, [blade]: updated }));
        });
    };

    const handleDrop = (e, blade, index) => {
        e.preventDefault();
        handlePhotoUpload(blade, index, e.dataTransfer.files);
    };

    const handleDragOver = (e) => e.preventDefault();

    const removePhoto = (blade, index, photoIndex) => {
        const updated = [...blades[blade]];
        updated[index].photos.splice(photoIndex, 1);
        setBlades(prev => ({ ...prev, [blade]: updated }));
    };

    const editPhoto = (blade, index, photoIndex, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = [...blades[blade]];
            updated[index].photos[photoIndex] = reader.result;
            setBlades(prev => ({ ...prev, [blade]: updated }));
        };
        reader.readAsDataURL(file);
    };
    // --- Fine gestione foto ---

    const handleSubmit = (e) => {
        e.preventDefault();

        const newReport = {
            id: reportToEdit?.id || Date.now(),
            title,
            info,
            blades,
            synced: false,
            lastModified: new Date().toISOString(),
        };

        if (reportToEdit) {
            setReports(prev => prev.map(r => r.id === reportToEdit.id ? newReport : r));
            saveReportOffline(newReport);
            alert("Report aggiornato offline!");
        } else {
            setReports(prev => [...prev, newReport]);
            saveReportOffline(newReport);
            alert("Report creato offline!");
        }

        navigate("/technical-reports");
    };

    if (!info || !blades) {
        return (
            <div className="page-container page-technical-report-new">
                <h2>Caricamento dati...</h2>
            </div>
        );
    }

    return (
        <div className="page-container page-technical-report-new">
            <h1>{reportToEdit ? "Modifica Report Tecnico" : "Creazione Report Tecnico"}</h1>

            <form className="report-form" onSubmit={handleSubmit}>

                <fieldset>
                    <legend>Titolo Report</legend>
                    <div className="form-group">
                        <label>Titolo</label>
                        <input type="text" value={title} onChange={handleTitleChange} />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Informazioni Report</legend>
                    {Object.entries(info).map(([key, value]) => (
                        <div className="form-group" key={key}>
                            <label>{key.replace(/([A-Z])/g, " $1")}</label>
                            <input
                                type={key.toLowerCase().includes("date") ? "date" : "text"}
                                name={key}
                                value={value}
                                onChange={handleInfoChange}
                            />
                        </div>
                    ))}
                </fieldset>

                {["A", "B", "C"].map(blade => (
                    <fieldset key={blade}>
                        <legend>Blade {blade}</legend>
                        {blades[blade].map((item, index) => (
                            <div className="blade-item" key={index}>
                                <h4>Item {index + 1}</h4>

                                <div className="form-group">
                                    <label>Radius</label>
                                    <input
                                        type="text"
                                        value={item.radius}
                                        onChange={(e) => handleBladeItemChange(blade, index, "radius", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        value={item.position}
                                        onChange={(e) => handleBladeItemChange(blade, index, "position", e.target.value)}
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Completed Task</label>
                                    <input
                                        type="text"
                                        value={item.task}
                                        onChange={(e) => handleBladeItemChange(blade, index, "task", e.target.value)}
                                    />
                                </div>

                                <Editor
                                    value={item.description}
                                    init={{
                                        height: 200,
                                        menubar: false,
                                        plugins: ['advlist', 'lists', 'link', 'image', 'code'],
                                        toolbar: 'undo redo | bold italic | bullist numlist | link image | code',
                                        branding: false,
                                        base_url: "/tinymce/js/tinymce",
                                        suffix: ".min",
                                        skin: "oxide",
                                        skin_url: "/tinymce/js/tinymce/skins/ui/oxide",
                                        content_css: "/tinymce/js/tinymce/skins/content/default/content.css",
                                        license_key: "gpl",
                                        tinymce_script_src: "/tinymce/js/tinymce/tinymce.min.js",
                                    }}
                                    onEditorChange={(content) => handleBladeItemChange(blade, index, "description", content)}
                                />

                                {/* --- BLOCCO FOTO --- */}
                                <div className="form-group dropzone" onDrop={(e) => handleDrop(e, blade, index)} onDragOver={handleDragOver}>
                                    <label>Upload Foto</label>
                                    <input type="file" multiple onChange={(e) => handlePhotoUpload(blade, index, Array.from(e.target.files))} />

                                    <div className="photo-preview">
                                        {item.photos.map((photo, i) => (
                                            <div className="photo-item" key={i}>
                                                <img src={photo} className="photo-thumb" alt={`Blade ${blade} foto ${i+1}`} />
                                                <div className="photo-actions">
                                                    <label className="btn-edit">
                                                        <IconEdit />
                                                        <input type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                                                            const newFile = e.target.files[0];
                                                            if (!newFile) return;
                                                            editPhoto(blade, index, i, newFile);
                                                        }} />
                                                    </label>
                                                    <button type="button" className="btn-delete" onClick={() => removePhoto(blade, index, i)}>
                                                        <IconTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                {/* --- FINE BLOCCO FOTO --- */}

                            </div>
                        ))}

                        <button type="button" className="btn btn-add-item" onClick={() => addBladeItem(blade)}>Aggiungi Item</button>
                    </fieldset>
                ))}

                <div className="form-actions">
                    <button type="submit" className="btn btn-save">{reportToEdit ? "Aggiorna Report" : "Salva Report"}</button>
                </div>

            </form>
        </div>
    );
};

export default TechnicalReportsNew;
