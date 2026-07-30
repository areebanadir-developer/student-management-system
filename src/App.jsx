import { useState, useEffect } from 'react';
import axios from "axios";
import './App.css'
import Swal from "sweetalert2";
import "./index.css";


function App() {
  const [name, setName] = useState("");
  const [rollNo, setRollNo] = useState("");
  const [department, setDepartment] = useState("");
  const [semester, setSemester] = useState("");
  const [cgpa, setCgpa] = useState("");

  const [students, setStudents] = useState([]);

  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [search, setSearch] = useState("");

  const addStudent = async () => {

    if (!name || !rollNo || !department || !semester || !cgpa) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please fill all fields!",
      });
      return;
    }

    const student = { name, rollNo, department, semester, cgpa };

    try {
      const res = await axios.post("http://localhost:5001/students", student);

      Swal.fire({
        icon: "success",
        title: "Success!",
        text: res.data.message,
        timer: 1800,
        showConfirmButton: false,
      });

      getStudents();
      setName("");
      setRollNo("");
      setDepartment("");
      setSemester("");
      setCgpa("");

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  const getStudents = async () => {
    try {
      const res = await axios.get("http://localhost:5001/students");
      setStudents(res.data);
    } catch (error) {
      console.log(error);
      alert("Failed to Fetch students");
    }
  };

  const updateStudent = async () => {

    const student = {
      name,
      rollNo,
      department,
      semester,
      cgpa
    };

    try {

      const res = await axios.put(
        `http://localhost:5001/students/${editId}`,
        student
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: res.data.message,
        timer: 1800,
        showConfirmButton: false,
      });

      await getStudents();

      setName("");
      setRollNo("");
      setDepartment("");
      setSemester("");
      setCgpa("");

      setEditId(null);
      setIsEditing(false);

    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const editStudent = (student) => {

    setName(student.name);
    setRollNo(student.rollNo);
    setDepartment(student.department);
    setSemester(student.semester);
    setCgpa(student.cgpa);

    setEditId(student._id);
    setIsEditing(true);

  };


  const deleteStudent = async (id) => {

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to recover this student!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#7C3AED",
      cancelButtonColor: "#EF4444",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirmDelete) return;

    try {

      const res = await axios.delete(
        `http://localhost:5001/students/${id}`
      );

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: res.data.message,
        timer: 1800,
        showConfirmButton: false,
      });

      await getStudents();

    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!",
      });
    }
  };

  useEffect(() => {
    getStudents();
  }, []);
  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-violet-50 to-purple-100 py-10 px-6">
        <div className="max-w-7xl mx-auto">

          <h1 className="text-5xl font-extrabold text-center text-violet-700">
            🎓 Student Management System
          </h1>

          <p className="text-center text-gray-600 mt-3 mb-10 text-lg">
            Manage Student Records Easily & Efficiently
          </p>

          {/* Stats Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-10">

            <div className="bg-violet-600 text-white rounded-2xl p-6 shadow-xl">
              <p className="text-sm opacity-80">
                Total Students
              </p>

              <h2 className="text-4xl font-bold mt-2">
                {students.length}
              </h2>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <p className="text-gray-500">
                Departments
              </p>

              <h2 className="text-4xl font-bold text-violet-700 mt-2">
                {[...new Set(students.map(student => student.department))].length}
              </h2>
            </div>

          </div>

          {/* Form */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-violet-200 p-8 mb-10">

            <h2 className="text-2xl font-bold text-violet-700 mb-6">
              ➕ Add New Student
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-4 rounded-2xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />

              <input
                type="text"
                placeholder="Roll Number"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                className="w-full p-4 rounded-2xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />

              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full p-4 rounded-2xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              >
                <option value="">Select Department</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Cyber Security">Cyber Security</option>
              </select>

              <select
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-4 rounded-2xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              >
                <option value="">Select Semester</option>
                <option value="1">Semester 1</option>
                <option value="2">Semester 2</option>
                <option value="3">Semester 3</option>
                <option value="4">Semester 4</option>
                <option value="5">Semester 5</option>
                <option value="6">Semester 6</option>
                <option value="7">Semester 7</option>
                <option value="8">Semester 8</option>
              </select>

              <input
                type="number"
                step="0.01"
                min="0"
                max="4"
                placeholder="CGPA"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                className="w-full p-4 rounded-2xl border border-violet-200 bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 transition md:col-span-2"
              />

            </div>

            <div className="flex justify-center mt-8">

              <button
                onClick={isEditing ? updateStudent : addStudent}
                className={`px-10 py-3 rounded-full text-white font-bold shadow-lg transition duration-300 hover:scale-105 ${isEditing
                  ? "bg-orange-500 hover:bg-orange-600"
                  : "bg-violet-600 hover:bg-violet-700"
                  }`}
              >
                {isEditing ? "✏️ Update Student" : "➕ Add Student"}
              </button>

            </div>

          </div>
          <div className="mb-6">
            <input
              type="text"
              placeholder="🔍 Search Student by Name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 rounded-2xl border border-violet-200 bg-white shadow-md focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          </div>

          {/* Student Records */}
          <div className="bg-white rounded-3xl shadow-2xl p-8">

            <h2 className="text-2xl font-bold text-violet-700 mb-6">
              📋 Student Records
            </h2>

            <div className="overflow-x-auto">

              <table className="w-full rounded-2xl overflow-hidden">

                <thead className="bg-violet-700 text-white">

                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Roll No</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Semester</th>
                    <th className="p-4">CGPA</th>
                    <th className="p-4">Action</th>
                  </tr>

                </thead>

                <tbody>

                  {students
                    .filter((student) =>
                      student.name.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((student) => (

                      <tr
                        key={student._id}
                        className="border-b hover:bg-violet-50 transition"
                      >

                        <td className="p-4 text-center">{student.name}</td>
                        <td className="p-4 text-center">{student.rollNo}</td>
                        <td className="p-4 text-center">{student.department}</td>
                        <td className="p-4 text-center">{student.semester}</td>
                        <td className="p-4 text-center">{student.cgpa}</td>

                        <td className="p-4 text-center">

                          <button
                            onClick={() => editStudent(student)}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg mr-2"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteStudent(student._id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                          >
                            Delete
                          </button>

                        </td>

                      </tr>

                    ))}

                  {students.filter((student) =>
                    student.name.toLowerCase().includes(search.toLowerCase())
                  ).length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="text-center py-8 text-gray-500"
                        >
                          No Students Found 📚
                        </td>
                      </tr>
                    )}

                </tbody>

              </table>

            </div>

          </div>

        </div>
      </div>
    </>
  )
}

export default App
