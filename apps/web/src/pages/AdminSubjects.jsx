import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Plus, Search, Pencil } from "lucide-react";

/* ================= MORE COLOR PRESETS ================= */
const COLOR_PRESETS = [
    { name: "Blue", light: "bg-blue-200", main: "bg-blue-500", dark: "bg-blue-600" },
    { name: "Sky", light: "bg-sky-200", main: "bg-sky-500", dark: "bg-sky-600" },
    { name: "Cyan", light: "bg-cyan-200", main: "bg-cyan-500", dark: "bg-cyan-600" },
    { name: "Teal", light: "bg-teal-200", main: "bg-teal-500", dark: "bg-teal-600" },

    { name: "Green", light: "bg-green-200", main: "bg-green-500", dark: "bg-green-600" },
    { name: "Emerald", light: "bg-emerald-200", main: "bg-emerald-500", dark: "bg-emerald-600" },

    { name: "Yellow", light: "bg-yellow-200", main: "bg-yellow-500", dark: "bg-yellow-600" },
    { name: "Orange", light: "bg-orange-200", main: "bg-orange-500", dark: "bg-orange-600" },

    { name: "Red", light: "bg-red-200", main: "bg-red-500", dark: "bg-red-600" },
    { name: "Rose", light: "bg-rose-200", main: "bg-rose-500", dark: "bg-rose-600" },

    { name: "Pink", light: "bg-pink-200", main: "bg-pink-500", dark: "bg-pink-600" },
    { name: "Fuchsia", light: "bg-fuchsia-200", main: "bg-fuchsia-500", dark: "bg-fuchsia-600" },


    { name: "Gray", light: "bg-gray-200", main: "bg-gray-500", dark: "bg-gray-600" },
    { name: "Stone", light: "bg-stone-200", main: "bg-stone-500", dark: "bg-stone-600" },

    { name: "Green Dark", light: "bg-green-300", main: "bg-green-600", dark: "bg-green-700" },
    { name: "Purple Dark", light: "bg-purple-300", main: "bg-purple-600", dark: "bg-purple-700" },
];

const ALL_GRADES = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "A/L"];

export default function AdminSubjects() {
    const [subjects, setSubjects] = useState([]);
    const [search, setSearch] = useState("");

    /* ================= FORM STATE ================= */
    const [form, setForm] = useState({
        name: "",
        teacher: "",
        grades: [],
        colors: COLOR_PRESETS[0],
    });

    const [editId, setEditId] = useState(null);

    /* ================= LOAD ================= */
    async function loadSubjects() {
        try {
            const res = await fetch("http://localhost:5000/api/subjects");
            const data = await res.json();
            setSubjects(data);
        } catch {
            toast.error("Failed to load subjects");
        }
    }

    useEffect(() => {
        loadSubjects();
    }, []);

    /* ================= ADD / UPDATE ================= */
    async function handleSubmit(e) {
        e.preventDefault();

        const url = editId
            ? `http://localhost:5000/api/subjects/${editId}`
            : "http://localhost:5000/api/subjects";

        const method = editId ? "PUT" : "POST";

        try {
            await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            toast.success(editId ? "Updated" : "Added");

            setForm({
                name: "",
                teacher: "",
                grades: [],
                colors: COLOR_PRESETS[0],
            });

            setEditId(null);
            loadSubjects();
        } catch {
            toast.error("Failed");
        }
    }

    /* ================= DELETE ================= */
    async function handleDelete(id) {
        try {
            await fetch(`http://localhost:5000/api/subjects/${id}`, {
                method: "DELETE",
            });

            toast.success("Deleted");
            loadSubjects();
        } catch {
            toast.error("Delete failed");
        }
    }

    /* ================= EDIT ================= */
    function handleEdit(s) {
        setForm({
            name: s.name,
            teacher: s.teacher,
            grades: s.grades || [],
            colors: s.colors || COLOR_PRESETS[0],
        });

        setEditId(s._id);
    }

    /* ================= FILTER ================= */
    const filtered = subjects.filter((s) =>
        (s.name || "").toLowerCase().includes(search.toLowerCase())
    );

    /* ================= UI ================= */
    return (
        <div className="p-6 max-w-7xl mx-auto space-y-6">

            {/* HEADER */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black">
                    Manage <span className="text-indigo-600">Subjects</span>
                </h2>

                <div className="relative">
                    <Search size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search subject..."
                        className="pl-9 pr-3 py-2 border rounded-lg text-sm"
                    />
                </div>
            </div>

            {/* ================= FORM ================= */}
            <form
                onSubmit={handleSubmit}
                className="bg-white border rounded-xl p-5 shadow space-y-4"
            >
                <h3 className="font-bold text-slate-700">
                    {editId ? "Edit Subject" : "Add New Subject"}
                </h3>

                {/* ONE ROW INPUTS */}
                <div className="grid md:grid-cols-3 gap-4">
                    <input
                        placeholder="Subject Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="border px-3 py-1 rounded-lg"
                        required
                    />

                    <input
                        placeholder="Teacher Name"
                        value={form.teacher}
                        onChange={(e) => setForm({ ...form, teacher: e.target.value })}
                        className="border px-3 py-1 rounded-lg"
                    />

                    <button
                        type="submit"
                        className="bg-indigo-600 text-white rounded-lg font-bold"
                    >
                        {editId ? "Update" : "Add"}
                    </button>
                </div>

                {/* GRADES */}
                <div className="flex flex-wrap gap-4">

                    <h5 className="text-sm font-semibold text-slate-600 mt-1">
                        Select Grades - 
                    </h5>

                    {ALL_GRADES.map((g) => {
                        const active = form.grades.includes(g);

                        return (
                            <button
                                key={g}
                                type="button"
                                onClick={() =>
                                    setForm((p) => ({
                                        ...p,
                                        grades: active
                                            ? p.grades.filter((x) => x !== g)
                                            : [...p.grades, g],
                                    }))
                                }
                                className={`px-3 py-0.5 rounded-full text-sm border ${active ? "bg-indigo-600 text-white" : ""
                                    }`}
                            >
                                {g}
                            </button>
                        );
                    })}
                </div>

                {/* COLOR SELECT */}
                <div className="flex flex-wrap gap-2">
                    {COLOR_PRESETS.map((c) => (
                        <button
                            key={c.name}
                            type="button"
                            onClick={() => setForm({ ...form, colors: c })}
                            className={`p-2 rounded-lg border w-16 ${form.colors.name === c.name ? "ring-2 ring-indigo-600" : ""
                                }`}
                        >
                            <div className={`h-3 ${c.light}`} />
                            <div className={`h-3 ${c.main}`} />
                            <div className={`h-3 ${c.dark}`} />
                        </button>
                    ))}
                </div>
            </form>

            {/* ================= TABLE ================= */}
            <div className="bg-white rounded-2xl shadow border overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-indigo-600 text-white">
                        <tr>
                            <th className="px-4 py-2 text-left">Subject Info</th>
                            <th className="px-4 py-2 text-center">Color</th>
                            <th className="px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filtered.map((s) => (
                            <tr key={s._id} className="border-t hover:bg-slate-50">

                                {/* ONE ROW COMPACT INFO */}
                                <td className="px-4 py-3">
                                    <div className="font-bold">{s.name}</div>
                                    <div className="text-xs text-slate-500">
                                        {s.teacher} • {s.grades?.join(", ")}
                                    </div>
                                </td>

                                {/* COLOR */}
                                <td className="px-4 py-3 text-center">
                                    <div className="flex gap-1 justify-center">
                                        <span className={`w-5 h-5 rounded ${s.colors?.light}`} />
                                        <span className={`w-5 h-5 rounded ${s.colors?.main}`} />
                                        <span className={`w-5 h-5 rounded ${s.colors?.dark}`} />
                                    </div>
                                </td>

                                {/* ACTIONS */}
                                <td className="px-4 py-3 text-center space-x-2">
                                    <button
                                        onClick={() => handleEdit(s)}
                                        className="bg-yellow-500 text-white p-1.5 rounded"
                                    >
                                        <Pencil size={14} />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(s._id)}
                                        className="bg-red-500 text-white p-1.5 rounded"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center py-6 text-slate-400">
                                    No subjects found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}