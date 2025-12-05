import React, { useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import IconEdit from "../assets/IconEdit.jsx";
import IconTrash from "../assets/IconTrash.jsx";


const TechnicalReportsNew = () => {
    const [info, setInfo] = useState({
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
    });

    const [blades, setBlades] = useState({
        A: [],
        B: [],
        C: [],
    });

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };

    const addBladeItem = (blade) => {
        setBlades((prev) => ({
            ...prev,
            [blade]: [
                ...prev[blade],
                { radius: "", position: "", task: "", description: "", photos: [] },
            ],
        }));
    };

    const removeBladeItem = (blade, index) => {
        const newItems = [...blades[blade]];
        newItems.splice(index, 1);
        setBlades((prev) => ({ ...prev, [blade]: newItems }));
    };

    const handleBladeItemChange = (blade, index, field, value) => {
        const newItems = [...blades[blade]];
        newItems[index][field] = value;
        setBlades((prev) => ({ ...prev, [blade]: newItems }));
    };

    const handlePhotoUpload = (blade, index, files) => {
        const newItems = [...blades[blade]];
        newItems[index].photos = [...newItems[index].photos, ...files];
        setBlades((prev) => ({ ...prev, [blade]: newItems }));
    };

    const handleDrop = (e, blade, index) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handlePhotoUpload(blade, index, files);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const removePhoto = (blade, index, photoIndex) => {
        const newItems = [...blades[blade]];
        newItems[index].photos.splice(photoIndex, 1);
        setBlades((prev) => ({ ...prev, [blade]: newItems }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Report Info:", info);
        console.log("Blades:", blades);
        alert("Report salvato! (demo offline)");
    };

    return (
        <div className="page-container page-technical-report-new">
            <h1>Creazione Report Tecnico</h1>

            <form className="report-form" onSubmit={handleSubmit}>
                {/* Blocco Info */}
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

                {/* Blocco Blade A/B/C */}
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
                                        onChange={(e) =>
                                            handleBladeItemChange(blade, index, "radius", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Position</label>
                                    <input
                                        type="text"
                                        value={item.position}
                                        onChange={(e) =>
                                            handleBladeItemChange(blade, index, "position", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Completed Task</label>
                                    <input
                                        type="text"
                                        value={item.task}
                                        onChange={(e) =>
                                            handleBladeItemChange(blade, index, "task", e.target.value)
                                        }
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <Editor
                                        value={item.description}
                                        init={{
                                            height: 200,
                                            menubar: false,

                                            // PLUGIN solo locali
                                            plugins: [
                                                "advlist", "autolink", "lists", "link",
                                                "image", "table", "code"
                                            ],

                                            toolbar:
                                                "undo redo | formatselect | bold italic underline | \
                                                 alignleft aligncenter alignright | bullist numlist | link image | code",

                                            // 📌 Percorsi COMPLETAMENTE locali
                                            base_url: "/tinymce/js/tinymce",
                                            suffix: ".min",

                                            skin: "oxide",
                                            skin_url: "/tinymce/js/tinymce/skins/ui/oxide",

                                            content_css: "/tinymce/js/tinymce/skins/content/default/content.css",

                                            // 📌 Forza la versione GPL → niente API key
                                            license_key: "gpl",

                                            // 📌 IMPORTANTISSIMO: forza TinyMCE a non usare CDN
                                            tinymce_script_src: "/tinymce/js/tinymce/tinymce.min.js",
                                        }}
                                        onEditorChange={(content) =>
                                            handleBladeItemChange(blade, index, "description", content)
                                        }
                                    />


                                </div>

                                <div
                                    className="form-group dropzone"
                                    onDrop={(e) => handleDrop(e, blade, index)}
                                    onDragOver={handleDragOver}
                                >
                                    <label>Upload Foto</label>
                                    <input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            handlePhotoUpload(blade, index, Array.from(e.target.files))
                                        }
                                    />
                                    <div className="photo-preview">
                                        {item.photos.map((file, i) => (
                                            <div className="photo-item" key={i}>

                                                {/* ANTEPRIMA IMMAGINE */}
                                                <img
                                                    src={URL.createObjectURL(file)}
                                                    alt="preview"
                                                    className="photo-thumb"
                                                />

                                                {/* CONTROLLI FOTO */}
                                                <div className="photo-actions">
                                                    {/* PULSANTE MODIFICA */}
                                                    <label className="btn-edit">
                                                        <IconEdit className="icon"/>
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            style={{ display: "none" }}
                                                            onChange={(e) => {
                                                                const newFile = e.target.files[0];
                                                                if (!newFile) return;

                                                                const newItems = [...blades[blade]];
                                                                newItems[index].photos[i] = newFile;
                                                                setBlades((prev) => ({ ...prev, [blade]: newItems }));
                                                            }}
                                                        />
                                                    </label>

                                                    {/* PULSANTE ELIMINA */}
                                                    <button
                                                        type="button"
                                                        className="btn-delete"
                                                        onClick={() => removePhoto(blade, index, i)}
                                                    >
                                                        <IconTrash className="icon"/>
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="drop-hint">
                                        Trascina qui le foto o clicca per selezionare
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    className="btn btn-remove-item"
                                    onClick={() => removeBladeItem(blade, index)}
                                >
                                    Elimina Item
                                </button>
                            </div>
                        ))}

                        <button
                            type="button"
                            className="btn btn-add-item"
                            onClick={() => addBladeItem(blade)}
                        >
                            Aggiungi Item
                        </button>
                    </fieldset>
                ))}

                <div className="form-actions">
                    <button type="submit" className="btn btn-save">
                        Salva Report
                    </button>
                </div>
            </form>
        </div>
    );
};

export default TechnicalReportsNew;
