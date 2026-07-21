// javascript
// src/pages/InspectionReportNew.jsx
import React, { useState, useRef, useMemo, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { useParams, useNavigate } from "react-router-dom";
import useInspectionReports from "../hooks/useInspectionReports";
import hotspotPin from "../assets/hotspot-pin.svg";

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
    synced: false,
};

const InspectionReportsNew = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { reports, setReports, loading } = useInspectionReports();
    const [title, setTitle] = useState("");

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
    const [serverPhotos, setServerPhotos] = useState([]);

    const reportToEdit = useMemo(() => (id ? reports.find((r) => String(r.id) === String(id)) : null), [id, reports]);

    const loadedReportIdRef = useRef(null);

    useEffect(() => {
        if (!id) {
            loadedReportIdRef.current = null;
            setTitle("");
            return;
        }
        const report = reports.find((r) => String(r.id) === String(id));
        if (!report) return;
        if (loadedReportIdRef.current === report.id) return;
        loadedReportIdRef.current = report.id;

        const infoToSet = report.info || {
            windFarm: "",
            customer: "",
            date: "",
            windTurbine: "",
            bladeType: "Other",
            bladeNumber: "",
            inspector: "",
        };

        // normalizza la data al formato YYYY-MM-DD per l'input date
        if (infoToSet.date) {
            try {
                infoToSet.date = String(infoToSet.date).split('T')[0];
            } catch (e) {
                // ignore
            }
        }

        const hydrateBlades = { A: [], B: [], C: [] };
        ["A", "B", "C"].forEach((b) => {
            const items = (report.blades && report.blades[b]) || [];
            hydrateBlades[b] = items.map((d) => {
                const copy = { ...emptyDamage, ...d };
                if (!Array.isArray(copy.previews) || copy.previews.length === 0) {
                    const possible = [];
                    if (Array.isArray(copy.photos)) {
                        copy.photos.forEach((p) => {
                            if (!p) return;
                            if (typeof p === "string" && (p.startsWith("http") || p.startsWith("data:"))) possible.push(p);
                            else if (p instanceof File) possible.push(URL.createObjectURL(p));
                        });
                    }
                    copy.previews = possible;
                }
                copy.photos = copy.photos || [];
                return copy;
            });
        });

        setTimeout(() => {
            setTitle(report.title || "");
            setInfo(infoToSet);
            setBlades(hydrateBlades);
        }, 0);
    }, [id, reports]);

    useEffect(() => {
        if (!modalOpen || typeof document === "undefined") return;
        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [modalOpen]);

    // Import attachments (media) dal server per questo report
    const importAttachments = async () => {
        try {
            const url = `https://mirodesign.it/off-line/blades-repair/wp-json/wp/v2/media?parent=${id}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Errore fetch media');
            const data = await res.json();
            const urls = Array.isArray(data)
                ? data.map((m) => m.source_url ?? m.sourceUrl ?? (m.guid && m.guid.rendered) ?? null).filter(Boolean)
                : [];
            setServerPhotos(urls);
        } catch (e) {
            console.error('Import attachments failed', e);
            alert('Impossibile importare allegati dal server');
        }
    };

    const handleInfoChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({ ...prev, [name]: value }));
    };
    const handleTitleChange = (e) => setTitle(e.target.value);

    const addBladeDamage = (blade) => {
        const newSpot = { ...emptyDamage, x: 50, y: 50 };
        setBlades((prev) => ({ ...prev, [blade]: [...(prev[blade] || []), newSpot] }));
    };

    const handleHotspotClick = (blade, index) => {
        const damage = (blades[blade] || [])[index];
        setCurrentBlade(blade);
        setCurrentDamageIndex(index);
        setNewDamage(damage || emptyDamage);
        setModalOpen(true);
    };

    const handleDrag = (e, blade, index) => {
        const container = e.target.parentNode.getBoundingClientRect();
        const x = ((e.clientX - container.left) / container.width) * 100;
        const y = ((e.clientY - container.top) / container.height) * 100;
        const updated = [...(blades[blade] || [])];
        updated[index] = { ...(updated[index] || {}), x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
        setBlades((prev) => ({ ...prev, [blade]: updated }));
    };

    const saveDamage = () => {
        const updated = [...(blades[currentBlade] || [])];
        const saved = { ...newDamage };
        if (!Array.isArray(saved.previews)) saved.previews = [];
        if (!Array.isArray(saved.photos)) saved.photos = [];
        updated[currentDamageIndex] = saved;
        setBlades((prev) => ({ ...prev, [currentBlade]: updated }));
        setModalOpen(false);
    };

    const handlePhotoUpload = (e) => {
        const files = Array.from(e.target.files || []).slice(0, 5);
        const previews = files.map((file) => URL.createObjectURL(file));
        setNewDamage((prev) => ({ ...prev, photos: files, previews }));
    };

    const removePhoto = (index) => {
        const newPhotos = [...(newDamage.photos || [])];
        const newPreviews = [...(newDamage.previews || [])];
        newPhotos.splice(index, 1);
        newPreviews.splice(index, 1);
        setNewDamage((prev) => ({ ...prev, photos: newPhotos, previews: newPreviews }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const normalizedTitle = (title || "").trim();
        const finalTitle = normalizedTitle || `Report Ispezione ${new Date().toLocaleDateString("it-IT")}`;
        const report = {
            id: reportToEdit?.id || Date.now(),
            title: finalTitle,
            info,
            blades,
            synced: reportToEdit?.synced || false,
            lastModified: new Date().toISOString(),
        };
        const updatedReports = reportToEdit
            ? reports.map((r) => (String(r.id) === String(reportToEdit.id) ? report : r))
            : [...reports, report];
        setReports(updatedReports);
        localStorage.setItem("inspectionReports", JSON.stringify(updatedReports));
        alert(reportToEdit ? "Report aggiornato offline!" : "Report salvato offline!");
        navigate("/inspection-reports");
    };

    // Se abbiamo un id ma il report non è trovato (dopo caricamento), mostra avviso
    if (id && !loading && !reportToEdit) {
        return (
            <div className="page-container page-inspection-report-new">
                <h1>Report non trovato</h1>
                <p>Il report con id {id} non è disponibile. Torna alla lista per selezionarne un altro.</p>
                <button onClick={() => navigate("/inspection-reports")}>Torna alla lista</button>
            </div>
        );
    }

    return (
        <div className="page-container page-inspection-report-new">
            <h1>{reportToEdit ? "Modifica Report Ispezione" : "Creazione Report Ispezione"}</h1>

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <legend>Titolo Report</legend>
                    <div className="form-group">
                        <label>Titolo</label>
                        <input type="text" value={title} onChange={handleTitleChange} />
                    </div>
                </fieldset>

                <fieldset>
                    <legend>Location</legend>
                    {["windFarm", "customer", "date"].map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key}</label>
                            <input type={key === "date" ? "date" : "text"} name={key} value={info[key] || ""} onChange={handleInfoChange} />
                        </div>
                    ))}
                </fieldset>

                {/** Turbine */}
                <fieldset>
                    <legend>Turbine</legend>
                    {["windTurbine", "bladeNumber"].map((key) => (
                        <div className="form-group" key={key}>
                            <label>{key}</label>
                            <input name={key} value={info[key] || ""} onChange={handleInfoChange} />
                        </div>
                    ))}

                    <div className="form-group">
                        <label>Blade Type</label>
                        <div className="radio-group">
                            {["Enercon", "Other"].map((type) => (
                                <label key={type}>
                                    <input type="radio" name="bladeType" value={type} checked={info.bladeType === type} onChange={handleInfoChange} />
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
                            <img src={`/images/pala_${(info.bladeType || "other").toLowerCase()}.jpg`} alt={`Blade ${blade}`} className="blade-image" />

                            {Array.isArray(blades[blade]) && blades[blade].map((damage, i) => (
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
                                    <img src={hotspotPin} alt="Hotspot danno" />
                                </div>
                            ))}
                        </div>
                    </fieldset>
                ))}

                <fieldset>
                    <legend>Inspector</legend>
                    <div className="form-group">
                        <label>Nome Ispettore</label>
                        <input name="inspector" value={info.inspector || ""} onChange={handleInfoChange} />
                    </div>
                </fieldset>

                <div className="form-actions">
                    <button type="submit" className="btn btn-save">{reportToEdit ? "Aggiorna Report" : "Salva Report"}</button>
                </div>
            </form>

            {modalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>{`Info Fault Number ${(currentDamageIndex ?? 0) + 1}`}</h3>
                        <label>Description</label>
                        {typeof window !== 'undefined' ? (
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
                                onEditorChange={(content) => setNewDamage((prev) => ({ ...prev, description: content }))}
                            />
                        ) : (
                            <textarea value={newDamage.description || ""} onChange={(e) => setNewDamage((prev) => ({ ...prev, description: e.target.value }))} />
                        )}

                        <label>Short Description</label>
                        <input type="text" value={newDamage.shortDescription || ""} onChange={(e) => setNewDamage((prev) => ({ ...prev, shortDescription: e.target.value }))} />

                        <label>Priority</label>
                        <select value={newDamage.priority} onChange={(e) => setNewDamage((prev) => ({ ...prev, priority: e.target.value }))}>
                            {["Low", "Medium", "High", "Critical", "Urgent"].map((p) => (
                                <option key={p}>{p}</option>
                            ))}
                        </select>

                        <label>Radius</label>
                        <input type="text" value={newDamage.radius || ""} onChange={(e) => setNewDamage((prev) => ({ ...prev, radius: e.target.value }))} />

                        <label>Location of Fault</label>
                        <input type="text" value={newDamage.location || ""} onChange={(e) => setNewDamage((prev) => ({ ...prev, location: e.target.value }))} />

                        <label>Dimension</label>
                        <input type="text" value={newDamage.dimension || ""} onChange={(e) => setNewDamage((prev) => ({ ...prev, dimension: e.target.value }))} />

                        <label>Upload Foto (max 5)</label>
                        <input type="file" multiple onChange={handlePhotoUpload} />

                        <div className="photo-preview">
                            {Array.isArray(newDamage.previews) && newDamage.previews.map((url, i) => (
                                <div className="photo-item" key={i}>
                                    <img src={url} alt="" className="photo-thumb" />
                                    <button type="button" className="btn-remove-photo" onClick={() => removePhoto(i)} aria-label="Rimuovi foto">
                                        ×
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="modal-buttons">
                            <button type="button" className="save-btn" onClick={saveDamage}>Salva</button>
                            <button type="button" className="close-btn" onClick={() => setModalOpen(false)}>Chiudi</button>
                        </div>
                    </div>
                </div>
            )}
            {reportToEdit && (Object.values(reportToEdit.info || {}).every((v) => v === null || v === "")) && (
                <div style={{ background: '#fff4e5', padding: 10, border: '1px solid #ffd7a6', marginBottom: 12 }}>
                    <strong>Attenzione:</strong> questo report non contiene informazioni dettagliate (cliente, windfarm, danni).
                    <div style={{ marginTop: 8 }}>
                        <button type="button" onClick={importAttachments}>Importa allegati (foto) dal server</button>
                    </div>
                    {serverPhotos.length > 0 && (
                        <div style={{ marginTop: 8 }}>
                            <strong>Server attachments:</strong>
                            <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                                {serverPhotos.map((u, i) => (
                                    <img key={i} src={u} alt="attachment" style={{ width: 120, height: 80, objectFit: 'cover', border: '1px solid #ccc' }} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InspectionReportsNew;
