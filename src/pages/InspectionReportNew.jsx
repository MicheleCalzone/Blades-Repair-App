import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import useInspectionReports from "../hooks/useInspectionReports";

const InspectionReportsNew = () => {
    const emptyDamage = {
        description: "",
        shortDescription: "",
        priority: "Medium",
        radius: "",
        location: "",
        dimension: "",
        photos: [],
        previews: [],
        x: 50,
        y: 50,
        synced: false, // nuovo flag
    };

    const { reports, setReports } = useInspectionReports();

    const [info, setInfo] = useState({
        windFarm: "",
        customer: "",
        date: "",
        windTurbine: "",
        bladeType: "Other",
        bladeNumber: "",
        inspector: "",
    });

    const [blades, setBlades] = useState({ A: [], B: [], C: [] });
    const [modalOpen, setModalOpen] = useState(false);
    const [currentBlade, setCurrentBlade] = useState(null);
    const [currentDamageIndex, setCurrentDamageIndex] = useState(null);
    const [newDamage, setNewDamage] = useState(emptyDamage);

    /* -------------------------- Gestione info -------------------------- */
    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    /* -------------------------- Blade damages ------------------------- */
    const addBladeDamage = (blade) => {
        const newSpot = { ...emptyDamage, x: 50, y: 50 };
        setBlades((prev) => ({
            ...prev,
            [blade]: [...prev[blade], newSpot],
        }));
    };

    const handleHotspotClick = (blade, index) => {
        const damage = blades[blade][index];
        setCurrentBlade(blade);
        setCurrentDamageIndex(index);
        setNewDamage(damage);
        setModalOpen(true);
    };

    const handleDrag = (e, blade, index) => {
        const container = e.target.parentNode.getBoundingClientRect();

        const x = ((e.clientX - container.left) / container.width) * 100;
        const y = ((e.clientY - container.top) / container.height) * 100;

        const updated = [...blades[blade]];
        updated[index].x = Math.max(0, Math.min(100, x));
        updated[index].y = Math.max(0, Math.min(100, y));

        setBlades((prev) => ({ ...prev, [blade]: updated }));
    };

    const saveDamage = () => {
        const updated = [...blades[currentBlade]];
        updated[currentDamageIndex] = newDamage;
        setBlades((prev) => ({ ...prev, [currentBlade]: updated }));
        setModalOpen(false);
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files).slice(0, 5);
        const previews = files.map((file) => URL.createObjectURL(file));
        setNewDamage((prev) => ({
            ...prev,
            photos: files,
            previews,
        }));
    };

    const removePhoto = (index) => {
        const newPhotos = [...newDamage.photos];
        const newPreviews = [...newDamage.previews];
        newPhotos.splice(index, 1);
        newPreviews.splice(index, 1);
        setNewDamage((prev) => ({ ...prev, photos: newPhotos, previews: newPreviews }));
    };

    /* -------------------------- SALVATAGGIO REPORT ------------------------- */
    const handleSubmit = (e) => {
        e.preventDefault();

        const report = {
            id: Date.now(),
            info,
            blades,
            synced: false, // flag per sincronizzazione
        };

        // salva localmente
        const updatedReports = [...reports, report];
        setReports(updatedReports);
        localStorage.setItem("inspectionReports", JSON.stringify(updatedReports));

        alert("Report salvato offline!");
    };

    /* -------------------------- RENDER PAGE ------------------------- */
    return (
        <div className="page-container page-inspection-report-new">
            <h1>Creazione Report Ispezioni</h1>

            <form onSubmit={handleSubmit}>
                {/* Info base */}
                <fieldset>
                    <legend>Location</legend>
                    {["windFarm", "customer", "date"].map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key}</label>
                            <input
                                type={key === "date" ? "date" : "text"}
                                name={key}
                                value={info[key]}
                                onChange={handleInfoChange}
                            />
                        </div>
                    ))}
                </fieldset>

                {/* Turbine */}
                <fieldset>
                    <legend>Turbine</legend>
                    {["windTurbine", "bladeNumber"].map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key}</label>
                            <input name={key} value={info[key]} onChange={handleInfoChange} />
                        </div>
                    ))}

                    <div className="form-group">
                        <label>Blade Type</label>
                        <div className="radio-group">
                            {["Enercon", "Other"].map((type) => (
                                <label key={type}>
                                    <input
                                        type="radio"
                                        name="bladeType"
                                        value={type}
                                        checked={info.bladeType === type}
                                        onChange={handleInfoChange}
                                    />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>
                </fieldset>

                {/* Blade damages */}
                {["A", "B", "C"].map((blade) => (
                    <fieldset key={blade}>
                        <legend>Blade {blade}</legend>
                        <button type="button" onClick={() => addBladeDamage(blade)}>
                            + Aggiungi Danno
                        </button>

                        <div className="blade-image-container">
                            <img
                                src={`/images/pala_${info.bladeType.toLowerCase()}.jpg`}
                                alt={`Blade ${blade}`}
                                className="blade-image"
                            />

                            {blades[blade].map((damage, i) => (
                                <div
                                    key={i}
                                    className="hotspot"
                                    style={{ top: `${damage.y}%`, left: `${damage.x}%` }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        const move = (ev) => handleDrag(ev, blade, i);
                                        const stop = () => {
                                            window.removeEventListener("mousemove", move);
                                            window.removeEventListener("mouseup", stop);
                                        };
                                        window.addEventListener("mousemove", move);
                                        window.addEventListener("mouseup", stop);
                                    }}
                                    onClick={() => handleHotspotClick(blade, i)}
                                >
                                    ⚠
                                </div>
                            ))}
                        </div>
                    </fieldset>
                ))}

                {/* Inspector */}
                <fieldset>
                    <legend>Inspector</legend>
                    <div className="form-group">
                        <label>Nome Ispettore</label>
                        <input name="inspector" value={info.inspector} onChange={handleInfoChange} />
                    </div>
                </fieldset>

                <button type="submit" className="save-btn">
                    Salva Report
                </button>
            </form>

            {/* Modale */}
            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Modifica Danno</h3>
                        <label>Description</label>
                        <Editor
                            value={newDamage.description}
                            init={{
                                height: 200,
                                menubar: false,
                                plugins: ["advlist", "autolink", "lists", "link", "image", "table", "code"],
                                toolbar:
                                    "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright | bullist numlist | link image | code",
                                base_url: "/tinymce/js/tinymce",
                                suffix: ".min",
                                skin: "oxide",
                                skin_url: "/tinymce/js/tinymce/skins/ui/oxide",
                                content_css: "/tinymce/js/tinymce/skins/content/default/content.css",
                                license_key: "gpl",
                                tinymce_script_src: "/tinymce/js/tinymce/tinymce.min.js",
                            }}
                            onEditorChange={(content) => setNewDamage({ ...newDamage, description: content })}
                        />

                        <label>Short Description</label>
                        <input
                            type="text"
                            value={newDamage.shortDescription}
                            onChange={(e) => setNewDamage({ ...newDamage, shortDescription: e.target.value })}
                        />

                        <label>Priority</label>
                        <select
                            value={newDamage.priority}
                            onChange={(e) => setNewDamage({ ...newDamage, priority: e.target.value })}
                        >
                            {["Low", "Medium", "High", "Critical", "Urgent"].map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>

                        <label>Radius</label>
                        <input
                            type="text"
                            value={newDamage.radius}
                            onChange={(e) => setNewDamage({ ...newDamage, radius: e.target.value })}
                        />

                        <label>Location of Fault</label>
                        <input
                            type="text"
                            value={newDamage.location}
                            onChange={(e) => setNewDamage({ ...newDamage, location: e.target.value })}
                        />

                        <label>Dimension</label>
                        <input
                            type="text"
                            value={newDamage.dimension}
                            onChange={(e) => setNewDamage({ ...newDamage, dimension: e.target.value })}
                        />

                        <label>Upload Foto (max 5)</label>
                        <input type="file" multiple onChange={handlePhotoUpload} />

                        <div className="photo-preview">
                            {newDamage.photos.map((file, i) => {
                                const imgUrl = URL.createObjectURL(file);
                                return (
                                    <div className="photo-item" key={i}>
                                        <img src={imgUrl} alt="" className="photo-thumb" />
                                        <button type="button" onClick={() => removePhoto(i)}>
                                            🗑
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="modal-actions">
                            <button onClick={saveDamage}>Salva</button>
                            <button onClick={() => setModalOpen(false)}>Chiudi</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InspectionReportsNew;
