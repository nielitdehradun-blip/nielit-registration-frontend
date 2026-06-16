import React, {
    useEffect,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import "../style/Students.css";
    const API_URL =
    import.meta.env.VITE_API_URL;

function Students() {
    const [students, setStudents] =
        useState([]);
    const [selectedStudent, setSelectedStudent] =
        useState(null);

    const [loading, setLoading] =
        useState(false);

    const [filters, setFilters] =
        useState({
            date: "",
            name: "",
            id: "",
        });

    const navigate = useNavigate();



    // Initial Load
    useEffect(() => {
        loadAllStudents();
    }, []);

    const loadAllStudents =
        async () => {
            try {
                setLoading(true);

                const response =
                    await fetch(
                        `${API_URL}/api/students`
                    );

                const data =
                    await response.json();

                if (data.success) {
                    setStudents(
                        data.students
                    );
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

    const handleChange = (
        e
    ) => {
        const { name, value } =
            e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const searchStudents =
        async () => {
            try {
                setLoading(true);

                const params =
                    new URLSearchParams();

                if (
                    filters.date.trim()
                ) {
                    params.append(
                        "date",
                        filters.date
                    );
                }

                if (
                    filters.name.trim()
                ) {
                    params.append(
                        "name",
                        filters.name
                    );
                }

                if (
                    filters.id.trim()
                ) {
                    params.append(
                        "id",
                        filters.id
                    );
                }

                const response =
                    await fetch(
                        `${API_URL}/api/students?${params}`
                    );

                const data =
                    await response.json();

                if (data.success) {
                    setStudents(
                        data.students
                    );
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

    const clearFilters = () => {
        setFilters({
            date: "",
            name: "",
            id: "",
        });

        loadAllStudents();
    };

    const downloadExcel = () => {

        const excelData =
            students.map((student) => ({
                "Student ID":
                    student.studentId,

                Name:
                    student.name,

                Age:
                    student.age,

                Gender:
                    student.gender,

                Qualification:
                    student.qualification,

                Course:
                    student.course,

                Category:
                    student.category,

                Phone:
                    student.phone,

                "Parent Phone":
                    student.parentPhone,

                WhatsApp:
                    student.whatsapp,

                Email:
                    student.email,

                City:
                    student.city,

                State:
                    student.state,

                Address:
                    student.address,

                "Registration Date":
                    new Date(
                        student.createdAt
                    ).toLocaleDateString(
                        "en-IN"
                    ),
            }));

        const worksheet =
            XLSX.utils.json_to_sheet(
                excelData
            );

        const workbook =
            XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            "Students"
        );

        const excelBuffer =
            XLSX.write(
                workbook,
                {
                    bookType: "xlsx",
                    type: "array",
                }
            );

        const fileData =
            new Blob(
                [excelBuffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            );

        saveAs(
            fileData,
            `Students_${new Date()
                .toISOString()
                .split("T")[0]
            }.xlsx`
        );
    };

    console.log("Selected: ", selectedStudent);
    return (
        <>
            {selectedStudent && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setSelectedStudent(null)
                    }
                >
                    <div
                        className="student-modal"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >
                        <button
                            className="close-btn"
                            onClick={() =>
                                setSelectedStudent(null)
                            }
                        >
                            ❌
                        </button>

                        <img
                            src={selectedStudent.photo}
                            alt={selectedStudent.name}
                            className="modal-photo"
                        />

                        <h2>{selectedStudent.name}</h2>

                        <div className="details-grid">

                            <div className="detail-card">
                                <strong>Student ID</strong>
                                <span>{selectedStudent.studentId}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Course</strong>
                                <span>{selectedStudent.course}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Qualification</strong>
                                <span>{selectedStudent.qualification}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Gender</strong>
                                <span>{selectedStudent.gender}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Age</strong>
                                <span>{selectedStudent.age}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Email</strong>
                                <span>{selectedStudent.email}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Phone</strong>
                                <span>{selectedStudent.phone}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Parent Phone</strong>
                                <span>{selectedStudent.parentPhone}</span>
                            </div>

                            <div className="detail-card">
                                <strong>WhatsApp</strong>
                                <span>{selectedStudent.whatsapp}</span>
                            </div>

                            <div className="detail-card">
                                <strong>City</strong>
                                <span>{selectedStudent.city}</span>
                            </div>

                            <div className="detail-card">
                                <strong>State</strong>
                                <span>{selectedStudent.state}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Category</strong>
                                <span>{selectedStudent.category}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Address</strong>
                                <span>{selectedStudent.address}</span>
                            </div>

                            <div className="detail-card">
                                <strong>Registered On</strong>
                                <span>
                                    {new Date(
                                        selectedStudent.createdAt
                                    ).toLocaleString("en-IN")}
                                </span>
                            </div>

                        </div>
                    </div>
                </div>
            )}
            <div className="students-page">

                {/* Home Button */}

                <div className="top-bar">
                    <button
                        className="home-btn"
                        onClick={() => navigate("/")}
                    >
                        🏠 Home
                    </button>
                </div>

                <div className="headerReg">
                    <h1>
                        Registered Students
                    </h1>

                    <p>
                        Total Students :
                        {" "}
                        {students.length}
                    </p>
                </div>

                {/* FILTERS */}

                <div className="filter-section">

                    <input
                        type="date"
                        name="date"
                        value={
                            filters.date
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        type="text"
                        name="name"
                        placeholder="Search by Name"
                        value={
                            filters.name
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <input
                        type="text"
                        name="id"
                        placeholder="Search by ID"
                        value={
                            filters.id
                        }
                        onChange={
                            handleChange
                        }
                    />

                    <button
                        className="search-btn"
                        onClick={
                            searchStudents
                        }
                    >
                        Search
                    </button>

                    <button
                        className="clear-btn"
                        onClick={
                            clearFilters
                        }
                    >
                        Reset
                    </button>
                    <button
                        className="excel-btn"
                        onClick={downloadExcel}
                    >
                        📊 Download Excel
                    </button>

                </div>

                {/* DATA */}

                {loading ? (
                    <h2 className="status">
                        Loading...
                    </h2>
                ) : students.length ===
                    0 ? (
                    <h2 className="status">
                        No Students Found
                    </h2>
                ) : (
                    <div className="students-grid">

                        {students.map(
                            (student) => (
                                <div
                                    className="student-card"
                                    key={student._id}
                                    onClick={() =>
                                        setSelectedStudent(student)
                                    }
                                >
                                    <img
                                        src={student.photo}
                                        alt={student.name}
                                        className="student-photo"
                                    />

                                    <div className="student-info">

                                        <h3>
                                            {
                                                student.name
                                            }
                                        </h3>


                                        <p>
                                            <strong>ID:</strong>{" "}
                                            {student.studentId}
                                        </p>


                                        <p>
                                            <strong>
                                                Course:
                                            </strong>
                                            {" "}
                                            {
                                                student.course
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Registration:
                                            </strong>
                                            {" "}
                                            {new Date(
                                                student.createdAt
                                            ).toLocaleDateString(
                                                "en-IN"
                                            )}
                                        </p>

                                    </div>
                                </div>
                            )
                        )}

                    </div>
                )}

            </div>
        </>
    );


}

export default Students;
