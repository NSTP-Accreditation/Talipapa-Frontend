import React, { useEffect, useState } from "react";
import { SquarePen, Plus, Trash2, Upload, Download, X } from "lucide-react";

/**
 * AchievementsAdmin
 * - Editable admin UI for your Achievements grid
 * - Stores data in localStorage under "achievements_admin_v1"
 * - Supports adding/editing/removing, image upload (base64) or image URL
 * - Export/Import JSON for migration or backup
 *
 * Drop this file into your React app. TailwindCSS expected.
 */

const LOCAL_KEY = "achievements_admin_v1";

/* ---------- utilities ---------- */
const readFileAsDataURL = (file) =>
  new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = rej;
    reader.readAsDataURL(file);
  });

/* ---------- default seed data (you provided) ---------- */
const DEFAULTS = [
  {
    title: "Barangay Clean-up Drive Award",
    description:
      "Recognized for outstanding environmental efforts in maintaining a clean and green community.",
    link: "https://example.com/cleanup-award",
    image:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80",
  },
  {
    title: "Health and Wellness Initiative",
    description:
      "Awarded for promoting community health through sustainable wellness programs.",
    link: "https://example.com/health-initiative",
    image:
      "https://images.unsplash.com/photo-1588072432836-e10032774350?w=800&q=80",
  },
  {
    title: "Community Safety Recognition",
    description:
      "Acknowledged for exemplary disaster preparedness and safety programs.",
    link: "https://example.com/safety-recognition",
    image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80",
  },
  {
    title: "Youth Empowerment Project",
    description:
      "Honored for empowering youth leaders to contribute actively to barangay programs.",
    link: "https://example.com/youth-project",
    image:
      "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=800&q=80",
  },
  {
    title: "Eco-Friendly Barangay",
    description:
      "Achieved for implementing innovative recycling and environmental conservation measures.",
    link: "https://example.com/eco-barangay",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80",
  },
  {
    title: "Best Barangay Documentation",
    description:
      "Awarded for excellence in record keeping, transparency, and governance.",
    link: "https://example.com/documentation-award",
    image: "",
  },
];

export default function AchievementsAdmin() {
  const [items, setItems] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null); // null => adding
  const [form, setForm] = useState({
    title: "",
    description: "",
    link: "",
    image: "", // can be URL or base64
  });
  const [fileUploading, setFileUploading] = useState(false);

  /* ---------- load from localStorage or defaults ---------- */
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setItems(JSON.parse(raw));
        return;
      } catch (e) {
        console.warn("Invalid local storage data, loading defaults.");
      }
    }
    setItems(DEFAULTS);
  }, []);

  /* ---------- persist whenever items change ---------- */
  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
  }, [items]);

  /* ---------- modal control ---------- */
  const openAdd = () => {
    setEditingIndex(null);
    setForm({ title: "", description: "", link: "", image: "" });
    setModalOpen(true);
  };
  const openEdit = (index) => {
    setEditingIndex(index);
    setForm(items[index]);
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setFileUploading(false);
  };

  /* ---------- form handlers ---------- */
  const handleChange = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const handleFile = async (file) => {
    if (!file) return;
    setFileUploading(true);
    try {
      const dataUrl = await readFileAsDataURL(file);
      // store base64 blob as image
      handleChange("image", dataUrl);
    } catch (e) {
      alert("Failed to read file.");
    } finally {
      setFileUploading(false);
    }
  };

  const handleSave = () => {
    if (!form.title.trim()) {
      alert("Title is required.");
      return;
    }
    if (editingIndex === null) {
      setItems((prev) => [form, ...prev]);
    } else {
      setItems((prev) => prev.map((it, i) => (i === editingIndex ? form : it)));
    }
    closeModal();
  };

  const handleDelete = (index) => {
    if (!confirm("Delete this achievement? This action cannot be undone.")) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- export / import ---------- */
  const handleExport = () => {
    const dataStr = JSON.stringify(items, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "achievements_export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error("Invalid format");
        // basic validation shape
        const clean = parsed.map((p) => ({
          title: p.title || "",
          description: p.description || "",
          link: p.link || "",
          image: p.image || "",
        }));
        setItems(clean);
        alert("Import successful. Data saved locally.");
      } catch (e) {
        alert("Invalid JSON file.");
      }
    };
    reader.readAsText(file);
  };

  /* ---------- small card component ---------- */
  const Card = ({ item, index }) => (
    <div className="bg-white p-6 rounded-xl flex flex-col items-center text-center border border-green-200 shadow-sm hover:shadow-lg transition">
      <div className="flex items-center justify-center w-full h-48 mb-4 overflow-hidden rounded-md bg-gray-50">
        {item.image ? (
          // image may be url or base64
          // fallback to object-cover
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <div className="text-gray-400">No image</div>
        )}
      </div>

      <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
      <p className="text-gray-600 text-sm mb-3">{item.description}</p>
      <a
        href={item.link || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="text-green-700 text-sm font-medium hover:underline mb-4"
      >
        {item.link ? "Learn more" : "No link"}
      </a>

      {/* Centered edit bar */}
      <div className="w-full mt-2">
        <div className="flex justify-center gap-3">
          <button
            onClick={() => openEdit(index)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full shadow hover:bg-green-50 transition"
            title="Edit"
          >
            <SquarePen size={16} /> Edit
          </button>

          <button
            onClick={() => handleDelete(index)}
            className="flex items-center gap-2 px-4 py-2 bg-white border rounded-full text-red-600 shadow hover:bg-red-50 transition"
            title="Delete"
          >
            <Trash2 size={16} /> Delete
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <section className="bg-white py-10 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* header / admin controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-green-800">Achievements — Admin</h2>
            <p className="text-gray-500 text-sm">Manage achievements: add, edit, delete, import/export.</p>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md cursor-pointer shadow">
              <Download size={16} />
              <input type="file" accept="application/json" className="hidden" onChange={(e) => handleImport(e.target.files?.[0])} />
              Import JSON
            </label>

            <button
              onClick={handleExport}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-md shadow hover:bg-green-50"
            >
              <Upload size={16} /> Export JSON
            </button>

            <button
              onClick={openAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md shadow hover:bg-green-700"
            >
              <Plus size={16} /> Add Achievement
            </button>
          </div>
        </div>

        {/* grid */}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.length === 0 ? (
            <div className="text-center text-gray-500 col-span-full">No achievements yet.</div>
          ) : (
            items.map((it, idx) => <Card key={idx} item={it} index={idx} />)
          )}
        </div>

        {/* Save-all hint */}
        <div className="mt-8 text-sm text-gray-500">
          <strong>Note:</strong> Data is saved locally in your browser (localStorage). To persist server-side, export and send the JSON to your backend API or connect this UI to an API endpoint.
        </div>
      </div>

      {/* ---------- modal (simple) ---------- */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">{editingIndex === null ? "Add Achievement" : "Edit Achievement"}</h3>
              <button onClick={closeModal} className="p-2 rounded hover:bg-gray-100">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <label className="block">
                <div className="text-sm font-medium mb-1">Title *</div>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange("title", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium mb-1">Description</div>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                  rows={4}
                />
              </label>

              <label className="block">
                <div className="text-sm font-medium mb-1">Link (optional)</div>
                <input
                  type="url"
                  value={form.link}
                  onChange={(e) => handleChange("link", e.target.value)}
                  className="w-full border rounded px-3 py-2"
                />
              </label>

              <div className="grid sm:grid-cols-2 gap-4">
                <label className="block">
                  <div className="text-sm font-medium mb-1">Image URL</div>
                  <input
                    type="url"
                    value={form.image && form.image.startsWith("data:") ? "" : form.image}
                    onChange={(e) => handleChange("image", e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    placeholder="https://..."
                  />
                </label>

                <label className="block">
                  <div className="text-sm font-medium mb-1">Or upload image (jpg, png)</div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFile(e.target.files?.[0])}
                    className="w-full"
                  />
                  {fileUploading && <div className="text-sm text-gray-500 mt-1">Uploading...</div>}
                </label>
              </div>

              {/* preview */}
              <div className="pt-2">
                <div className="text-sm font-medium mb-1">Preview</div>
                <div className="w-full h-44 bg-gray-50 rounded overflow-hidden flex items-center justify-center">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={form.image} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400">No image selected</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button onClick={closeModal} className="px-4 py-2 rounded border">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 rounded bg-green-600 text-white">Save</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
