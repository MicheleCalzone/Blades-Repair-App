import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Editor } from "@tinymce/tinymce-react";
import IconTrash from "../assets/IconTrash.jsx";
import IconEdit from "../assets/IconEdit.jsx";
import { useTechnicalReports } from "../hooks/useTechnicalReports";
import { get, set } from "idb-keyval";
import { withAuth } from "../services/auth";

const TINYMCE_BASE_URL = `${import.meta.env.BASE_URL}tinymce/js/tinymce`;

const normalizePhotoReference = (photo) => {
    if (photo === null || photo === undefined || photo === "") return null;
    if (typeof photo === "string") {
        const trimmed = photo.trim();
        if (!trimmed) return null;
        if (trimmed.startsWith("http") || trimmed.startsWith("data:")) return trimmed;
        if (/^\d+$/.test(trimmed)) return Number(trimmed);
        return trimmed;
    }
    if (typeof photo === "number") return photo;
    if (typeof photo === "object") {
        const id = photo.id ?? photo.ID ?? photo.mediaId ?? photo.media_id ?? null;
        if (id !== null && id !== undefined) return normalizePhotoReference(id);
        const url = photo.url ?? photo.src ?? photo.image ?? photo.link ?? null;
        if (url) return normalizePhotoReference(url);
    }
    return null;
};

const fetchPhotoUrl = async (photoInput) => {
    try {
        const normalized = normalizePhotoReference(photoInput);
        if (!normalized) return null;
        if (typeof normalized === "string" && (normalized.startsWith("http") || normalized.startsWith("data:"))) {
            return normalized;
        }

        const id = Number(normalized);
        if (!Number.isFinite(id) || id <= 0) return typeof normalized === "string" ? normalized : null;

        const cached = await get(`photo_${id}`);
        if (cached) return cached;

        const res = await fetch(`https://mirodesign.it/off-line/blades-repair/wp-json/blades/v1/image?id=${id}`, withAuth({ method: "GET" }));
        if (!res.ok) return null;

        const data = await res.json();
        if (!data || !data.url) return null;

        await set(`photo_${id}`, data.url);
        return data.url;
    } catch (error) {
        console.error("Errore risoluzione foto tecnica", error);
        return null;
    }
};

const cloneBladeItem = (item = {}) => ({
    ...item,
    photos: Array.isArray(item.photos) ? [...item.photos] : [],
});

const cloneBladeState = (bladesState = emptyBlades) => ({
    A: Array.isArray(bladesState.A) ? bladesState.A.map(cloneBladeItem) : [],
    B: Array.isArray(bladesState.B) ? bladesState.B.map(cloneBladeItem) : [],
    C: Array.isArray(bladesState.C) ? bladesState.C.map(cloneBladeItem) : [],
});

const TechnicalReportsNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reports, saveReportOffline } = useTechnicalReports();

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
    const [pageNotice, setPageNotice] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const reportToEdit = id ? reports.find((r) => r.id.toString() === id) : null;

    useEffect(() => {
        if (!pageNotice) return;
        const timer = setTimeout(() => setPageNotice(null), 3500);
        return () => clearTimeout(timer);
    }, [pageNotice]);

    useEffect(() => {
        if (!id || !reportToEdit) {
            setTitle("");
            setInfo(emptyInfo);
            setBlades(emptyBlades);
            return;
        }

        const loadPhotos = async () => {
            const bladesCopy = cloneBladeState(reportToEdit.blades || emptyBlades);

            for (const blade of ["A", "B", "C"]) {
                for (let i = 0; i < bladesCopy[blade].length; i++) {
                    const item = bladesCopy[blade][i];
                    const photoList = Array.isArray(item?.photos) ? item.photos : [];
                    if (photoList.length > 0) {
                        const photosResolved = await Promise.all(
                            photoList.map(async (photo) => fetchPhotoUrl(photo))
                        );
                        bladesCopy[blade][i] = { ...item, photos: photosResolved.filter(Boolean) };
                    }
                }
            }

            setBlades(bladesCopy);
        };

        setTitle(reportToEdit.title || reportToEdit.info?.name || "");
        setInfo(reportToEdit.info || emptyInfo);
        loadPhotos();
    }, [id, reportToEdit]);

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleTitleChange = (e) => setTitle(e.target.value);

    const addBladeItem = (blade) => {
        setBlades((prev) => ({
            ...cloneBladeState(prev),
            [blade]: [...(prev[blade] || []), { radius: "", position: "", task: "", description: "", photos: [] }],
        }));
    };

    const removeBladeItem = (blade, index) => {
        const updated = [...(blades[blade] || [])].filter((_, i) => i !== index);
        setBlades((prev) => ({ ...cloneBladeState(prev), [blade]: updated }));
    };

    const handleBladeItemChange = (blade, index, field, value) => {
        const updated = [...(blades[blade] || [])];
        updated[index] = { ...updated[index], [field]: value };
        setBlades((prev) => ({ ...cloneBladeState(prev), [blade]: updated }));
    };

    // --- Foto ---
    const handlePhotoUpload = (blade, index, files) => {
        const updated = [...(blades[blade] || [])];

        const readFiles = Array.from(files).map((file) => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readFiles).then((results) => {
            const currentItem = { ...updated[index], photos: [...(updated[index]?.photos || [])] };
            currentItem.photos = [...currentItem.photos, ...results];
            updated[index] = currentItem;
            setBlades((prev) => ({ ...cloneBladeState(prev), [blade]: updated }));
        });
    };

    const handleDrop = (e, blade, index) => {
        e.preventDefault();
        handlePhotoUpload(blade, index, e.dataTransfer.files);
    };

    const handleDragOver = (e) => e.preventDefault();

    const removePhoto = (blade, index, photoIndex) => {
        const updated = [...(blades[blade] || [])];
        const currentItem = { ...updated[index], photos: [...(updated[index]?.photos || [])] };
        currentItem.photos.splice(photoIndex, 1);
        updated[index] = currentItem;
        setBlades((prev) => ({ ...cloneBladeState(prev), [blade]: updated }));
    };

    const editPhoto = (blade, index, photoIndex, file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const updated = [...(blades[blade] || [])];
            const currentItem = { ...updated[index], photos: [...(updated[index]?.photos || [])] };
            currentItem.photos[photoIndex] = reader.result;
            updated[index] = currentItem;
            setBlades((prev) => ({ ...cloneBladeState(prev), [blade]: updated }));
        };
        reader.readAsDataURL(file);
    };
    // --- Fine foto ---

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSaving) return;

        setIsSaving(true);

        try {
            const normalizedTitle = (title || info.name || "").trim();
            const finalTitle = normalizedTitle || `Report Tecnico ${new Date().toLocaleDateString("it-IT")}`;
            const newReport = {
                id: reportToEdit?.id || Date.now(),
                title: finalTitle,
                info: {
                    ...info,
                    name: normalizedTitle,
                },
                blades,
                synced: false,
                lastModified: new Date().toISOString(),
            };

            await saveReportOffline(newReport);
            setPageNotice({
                type: 'success',
                text: reportToEdit ? 'Report aggiornato offline!' : 'Report creato offline!'
            });
        } catch (error) {
            setPageNotice({
                type: 'error',
                text: error?.message || 'Errore durante il salvataggio del report',
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (!info || !blades) return <div className="page-container page-technical-report-new"><h2>Caricamento dati...</h2></div>;

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
                    {Object.entries(info).filter(([key]) => key !== "name").map(([key, value]) => (
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

                {["A", "B", "C"].map((blade) => (
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
                                        base_url: TINYMCE_BASE_URL,
                                        suffix: ".min",
                                        skin: "oxide",
                                        skin_url: `${TINYMCE_BASE_URL}/skins/ui/oxide`,
                                        content_css: `${TINYMCE_BASE_URL}/skins/content/default/content.css`,
                                        license_key: "gpl",
                                        tinymce_script_src: `${TINYMCE_BASE_URL}/tinymce.min.js`,
                                    }}
                                    onEditorChange={(content) => handleBladeItemChange(blade, index, "description", content)}
                                />

                                {/* BLOCCO FOTO */}
                                <div className="form-group dropzone" onDrop={(e) => handleDrop(e, blade, index)} onDragOver={handleDragOver}>
                                    <label>Upload Foto</label>
                                    <input type="file" multiple onChange={(e) => handlePhotoUpload(blade, index, Array.from(e.target.files))} />

                                    <div className="photo-preview">
                                        {item.photos.map((photo, i) => (
                                            <div className="photo-item" key={i}>
                                                <img src={photo} className="photo-thumb" alt={`Blade ${blade} foto ${i + 1}`} />
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
                                {/* FINE BLOCCO FOTO */}

                            </div>
                        ))}
                        <button type="button" className="btn btn-add-item" onClick={() => addBladeItem(blade)}>Aggiungi Item</button>
                    </fieldset>
                ))}

                <div className="form-actions">
                    <button type="submit" className="btn btn-save" disabled={isSaving}>
                        {isSaving ? (
                            <span className="btn-loader" aria-label="Salvataggio in corso" title="Salvataggio in corso" />
                        ) : (
                            reportToEdit ? "Aggiorna Report" : "Salva Report"
                        )}
                    </button>
                </div>

                {pageNotice && (
                    <div className={`page-notice page-notice-${pageNotice.type}`} role="status" aria-live="polite">
                        {pageNotice.text}
                    </div>
                )}

            </form>
        </div>
    );
};

export default TechnicalReportsNew;
