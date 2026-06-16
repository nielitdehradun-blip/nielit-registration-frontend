import React, { useEffect, useRef, useState } from "react";
import "../style/Registration.css";
import { useNavigate } from "react-router-dom";
import {
    State,
    City,
} from "country-state-city";

const API_URL =
    import.meta.env.VITE_API_URL;

function Registration() {

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    const initialFormData = {
        name: "",
        age: "",
        gender: "",
        city: "",
        state: "",
        address: "",
        qualification: "",
        phone: "",
        parentPhone: "",
        whatsapp: "",
        email: "",
        category: "",
        course: "",
    };



    const [formData, setFormData] = useState(initialFormData);
    const states =
        State.getStatesOfCountry("IN");
    const cities =
        City.getCitiesOfState(
            "IN",
            formData.stateCode
        );
    const [preview, setPreview] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    console.log(loading)

    const courses = {
        "GEN/OBC": ["CCC", "O Level", "A Level", "B Level"],
        "SC/ST": ["CCC", "O Level", "PMKVY"],
    };

    useEffect(() => {
        startCamera();

        return () => {
            if (videoRef.current?.srcObject) {
                videoRef.current.srcObject
                    .getTracks()
                    .forEach((track) => track.stop());
            }
        };
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error(error);
            alert("Camera access denied");
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;

        const numericValue = value.replace(/\D/g, "").slice(0, 10);

        setFormData((prev) => ({
            ...prev,
            [name]: numericValue,
        }));
    };

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject
                .getTracks()
                .forEach((track) => track.stop());
        }
    };

    const capture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video) return;

        const ctx = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        ctx.drawImage(video, 0, 0);

        const image = canvas.toDataURL("image/png");

        setPreview(image);

        stopCamera();
    };

    const validatePhone = (number) => {
        return /^\d{10}$/.test(number);
    };

    const resetForm = () => {
        setFormData(initialFormData);
        setPreview("");
    };

    const sendWhatsappMessage = () => {
        let number = formData.whatsapp.replace(/\D/g, "");

        if (!number.startsWith("91")) {
            number = "91" + number;
        }

        let courseInfo = "";

        switch (formData.course) {
            case "CCC":
                courseInfo = "Duration: 3 Months | Fees: ₹2500";
                break;

            case "O Level":
                courseInfo = "Duration: 1 Year | Fees: ₹12000";
                break;

            case "PMKVY":
                courseInfo = "Duration: 2 Months | Fees: Free";
                break;

            default:
                courseInfo = "";
        }

        const message = `Hello ${formData.name},

  Your inquiry for ${formData.course} has been received.

  ${courseInfo}

  Contact: 7302602223

  Thank You`;

        const whatsappURL = `https://wa.me/${number}?text=${encodeURIComponent(
            message
        )}`;

        window.open(whatsappURL, "_blank");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!preview) {
            alert("Please capture photo first");
            return;
        }

        if (
            !validatePhone(formData.phone) ||
            !validatePhone(formData.parentPhone) ||
            !validatePhone(formData.whatsapp)
        ) {
            alert("All phone numbers must be exactly 10 digits");
            return;
        }

        setLoading(true);

        const submitData = new FormData();

        Object.entries(formData).forEach(([key, value]) => {
            submitData.append(key, value);
        });

        canvasRef.current.toBlob(
            async (blob) => {
                try {

                    submitData.append(
                        "photo",
                        blob,
                        "student-photo.png"
                    );

                    const response = await fetch(
                        `${API_URL}/api/register`,
                        {
                            method: "POST",
                            body: submitData,
                        }
                    );

                    const result =
                        await response.json();

                    if (!response.ok) {
                        throw new Error(
                            result.message
                        );
                    }

                    setMessage(
                        result.message || "Registration Successful"
                    );

                    setMessageType("success");

                    sendWhatsappMessage();
                    resetForm();

                } catch (error) {

                    console.error(error);

                    setMessage(
                        error.message ||
                        "Submission Failed"
                    );

                    setMessageType("error");

                } finally {

                    setLoading(false);

                }
            },
            "image/png",
            1
        );
    };

    useEffect(() => {
        console.log(
            "Loading:",
            loading
        );
    }, [loading]);

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 5000);

        return () => clearTimeout(timer);
    }, [message]);

    return (
        <>
            {loading && (
                <div className="loading-overlay">
                    <div className="loading-box">
                        <div className="spinner"></div>

                        <h2>Registering Student...</h2>

                        <p>
                            Please wait while we save
                            the registration details.
                        </p>
                    </div>
                </div>
            )}



            <div className="app">
                <div className="container">
                    <div className="top-bar">
                        <button
                            className="home-btn"
                            onClick={() => navigate("/")}
                        >
                            🏠 Home
                        </button>
                    </div>
                    <div className="header">
                        <h1>NIELIT DEHRADUN</h1>
                        <p>Student Inquiry Registration Form</p>

                    </div>
                    {message && (
                        <div
                            className={`message-box ${messageType}`}
                        >
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-section">
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />

                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                            <select
                                name="qualification"
                                value={formData.qualification}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select Qualification
                                </option>

                                <option value="10th or Equivalent">
                                    10th or Equivalent
                                </option>

                                <option value="12th or Equivalent">
                                    12th or Equivalent
                                </option>

                                <option value="ITI">
                                    ITI
                                </option>

                                <option value="Diploma">
                                    Diploma
                                </option>

                                <option value="Graduation">
                                    Graduation
                                </option>

                                <option value="Post Graduation">
                                    Post Graduation
                                </option>

                                <option value="PhD">
                                    PhD
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>

                            <input
                                type="text"
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                            />

                            <select
                                name="stateCode"
                                value={formData.stateCode}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select State
                                </option>

                                {states.map((state) => (
                                    <option
                                        key={state.isoCode}
                                        value={state.isoCode}
                                    >
                                        {state.name}
                                    </option>
                                ))}
                            </select>

                            {/* <select
                                name="district"
                                value={formData.district}
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select District
                                </option>

                                {cities.map((city) => (
                                    <option
                                        key={city.name}
                                        value={city.name}
                                    >
                                        {city.name}
                                    </option>
                                ))}
                            </select> */}



                            <input
                                type="text"
                                name="phone"
                                placeholder="Student Phone"
                                value={formData.phone}
                                onChange={handleNumberChange}
                                required
                            />

                            <input
                                type="text"
                                name="parentPhone"
                                placeholder="Parent Phone"
                                value={formData.parentPhone}
                                onChange={handleNumberChange}
                                required
                            />

                            <input
                                type="text"
                                name="whatsapp"
                                placeholder="WhatsApp Number"
                                value={formData.whatsapp}
                                onChange={handleNumberChange}
                                required
                            />

                            <input
                                type="email"
                                name="email"
                                placeholder="Email Address"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />

                            <textarea
                                name="address"
                                placeholder="Full Address"
                                value={formData.address}
                                onChange={handleChange}
                                rows="4"
                            />

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="GEN/OBC">GEN/OBC</option>
                                <option value="SC/ST">SC/ST</option>
                            </select>

                            <select
                                name="course"
                                value={formData.course}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Course</option>

                                {formData.category &&
                                    courses[formData.category]?.map((course) => (
                                        <option
                                            key={course}
                                            value={course}
                                        >
                                            {course}
                                        </option>
                                    ))}
                            </select>
                        </div>

                        <div className="camera-section">
                            <div className="camera-card">

                                {!preview ? (
                                    <>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            playsInline
                                            className="camera-feed"
                                        />

                                        <button
                                            type="button"
                                            className="capture-btn"
                                            onClick={capture}
                                        >
                                            📸 Capture Photo
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="preview-image"
                                        />

                                        <div className="photo-actions">

                                            <button
                                                type="button"
                                                className="retake-btn"
                                                onClick={() => {
                                                    setPreview("");
                                                    startCamera();
                                                }}
                                            >
                                                🔄 Retake Photo
                                            </button>

                                            {/* <button
                        type="button"
                        className="reset-btn"
                        onClick={() => {
                          setPreview("");
                        }}
                      >
                        ❌ Remove
                      </button> */}

                                        </div>
                                    </>
                                )}

                                <canvas ref={canvasRef}></canvas>

                            </div>

                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Registration"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );

}

export default Registration;