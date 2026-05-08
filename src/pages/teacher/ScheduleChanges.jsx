import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MapPin, Clock, ChevronDown, CheckCircle, X, User } from "lucide-react";
import "./ScheduleChanges.css";

const ScheduleChanges = () => {
    const BASE_URL = "http://localhost:8000"; 
    const todayStr = new Date().toISOString().split('T')[0];
    
    const [schedule, setSchedule] = useState([]);
    const [selectedDate, setSelectedDate] = useState(todayStr);
    const [loading, setLoading] = useState(true);
    const [activeActionId, setActiveActionId] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [modalDetails, setModalDetails] = useState(null);
    const [modalMessage, setModalMessage] = useState("");
    const [swapSuccessDetails, setSwapSuccessDetails] = useState(null);
    
    const [showDatePickerModal, setShowDatePickerModal] = useState(false);
    const [tempDate, setTempDate] = useState(todayStr);
    const [activeItem, setActiveItem] = useState(null);
    const [operationType, setOperationType] = useState("");

    const [showSwapView, setShowSwapView] = useState(false);
    const [upcomingClasses, setUpcomingClasses] = useState([]);
    const [swapLoading, setSwapLoading] = useState(false);

    const teacherId = localStorage.getItem("userId");
    const teacherName = localStorage.getItem("userName");

    useEffect(() => {
        fetchSchedule();
    }, [selectedDate]);

    const fetchSchedule = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                `${BASE_URL}/teacher/schedule-status/${teacherId}?selected_date=${selectedDate}`
            );
            setSchedule(response.data);
        } catch (error) {
            console.error("Error fetching schedule:", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleActionMenu = (id) => {
        setActiveActionId(activeActionId === id ? null : id);
    };

    const openDatePicker = (item, type) => {
        setActiveItem(item);
        setOperationType(type);
        setTempDate(todayStr);
        setShowDatePickerModal(true);
        setActiveActionId(null);
    };

    const handleSwapClick = async (item) => {
        setActiveActionId(null);
        setActiveItem(item);
        try {
            setSwapLoading(true);
            const params = {
                discipline: item.Discipline,
                semester: item.Semester,
                section: item.Section,
                day: item.Day,
                venue_id: item.Venue,
                class_start_time: item.Class_Start_Time
            };
            const response = await axios.get(`${BASE_URL}/teacher/upcoming-classes`, { params });
            setUpcomingClasses(response.data);
            setShowSwapView(true);
        } catch (error) {
            alert("Error fetching upcoming classes for swap");
        } finally {
            setSwapLoading(false);
        }
    };

    const processSwap = async (targetClass) => {
        const payload = {
            teacherAName: teacherName,
            teacherBName: targetClass["Teacher Name"],
            courseAName: activeItem["Course Name"],
            courseBName: targetClass["Course Name"],
            discipline: activeItem.Discipline,
            semester: activeItem.Semester,
            section: activeItem.Section,
            day: activeItem.Day,
            startTime: activeItem.Class_Start_Time,
            endTime: activeItem.Class_End_Time,
            venueA: activeItem.Venue,
            venueB: targetClass.Venue
        };

        try {
            setSwapLoading(true);
            const response = await axios.post(`${BASE_URL}/teacher/swapClass`, payload);
            if (response.data.status === "Success") {
                setModalMessage(response.data.message);
                setSwapSuccessDetails(response.data);
                setShowSwapView(false);
                setShowSuccessModal(true);
                fetchSchedule();
            }
        } catch (error) {
            alert(error.response?.data?.detail || "Swap operation failed");
        } finally {
            setSwapLoading(false);
        }
    };

    const handleConfirm = async () => {
        if (!activeItem) return;

        const dateObj = new Date(tempDate);
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        const payload = {
            teacherName: teacherName || "Teacher",
            courseName: activeItem["Course Name"],
            discipline: activeItem.Discipline,
            semester: activeItem.Semester,
            section: activeItem.Section,
            old_Day: activeItem.Day,
            old_class_start_time: activeItem.Class_Start_Time,
            old_class_end_time: activeItem.Class_End_Time,
            new_Day: dayName,
            schedule_id: activeItem.Schedule,
            new_date: tempDate
        };

        const endpoint = operationType === "reschedule" 
            ? `${BASE_URL}/teacher/RescheduleClass` 
            : `${BASE_URL}/teacher/prescheduleClass`;

        try {
            setShowDatePickerModal(false);
            setLoading(true);
            const response = await axios.post(endpoint, payload);
            if (response.data.status === "Success") {
                setModalDetails(response.data.details);
                setModalMessage(response.data.message);
                setSwapSuccessDetails(null);
                setShowSuccessModal(true);
                fetchSchedule();
            }
        } catch (error) {
            alert(error.response?.data?.detail || "Operation failed");
        } finally {
            setLoading(false);
            setActiveItem(null);
        }
    };

    const getMaxDate = () => {
        if (operationType === "preschedule" && activeItem) {
            return activeItem.Date || todayStr;
        }
        return "";
    };

    const renderProfilePic = (picPath) => {
        if (!picPath) return <div className="placeholder-avatar"><User size={24} /></div>;
        const cleanPath = picPath.replace(/\\/g, '/');
        const finalUrl = cleanPath.startsWith('http') ? cleanPath : `${BASE_URL}/${cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath}`;
        return (
            <img 
                src={finalUrl} 
                alt="Teacher" 
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `https://ui-avatars.com/api/?name=Teacher&background=0066ff&color=fff`;
                }}
            />
        );
    };

    if (showSwapView) {
        return (
            <div className="swap-view-container">
                <div className="swap-header">
                    <button className="back-btn" onClick={() => setShowSwapView(false)}>
                        <X size={24} color="white" />
                    </button>
                    <h1>Upcoming Classes for Swap</h1>
                </div>
                <div className="swap-content">
                    {upcomingClasses.length > 0 ? (
                        upcomingClasses.map((uClass, index) => (
                            <div key={index} className="swap-card">
                                <div className="teacher-header">
                                    <div className="avatar-wrapper">
                                        {renderProfilePic(uClass.ProfilePic)}
                                    </div>
                                    <div className="teacher-text">
                                        <h2>{uClass["Teacher Name"]}</h2>
                                        <p className="course-accent">{uClass["Course Name"]}</p>
                                    </div>
                                </div>
                                <div className="swap-divider"></div>
                                <div className="swap-details">
                                    <p><strong>Discipline:</strong> {uClass.Discipline}-{uClass.Semester}{uClass.Section}</p>
                                    <p><strong>Time:</strong> {uClass["Class Start Time"]}-{uClass["Class End Time"]}</p>
                                    <p><strong>Venue:</strong> {uClass.Venue}</p>
                                    <p><strong>Date:</strong> {uClass.Date} ({uClass.Day})</p>
                                </div>
                                <button className="process-swap-btn" onClick={() => processSwap(uClass)}>
                                    Process to Swap Class
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="no-data">No upcoming classes available for swap.</div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="schedule-container">
            <div className="schedule-header">
                <h1>Schedule</h1>
                <div className="date-picker-wrapper" onClick={() => openDatePicker(null, "filter")}>
                    <div className="date-info">
                        <span className="day-name">
                            {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long' })}
                        </span>
                        <span className="full-date">
                            {new Date(selectedDate).toLocaleDateString('en-GB').replace(/\//g, '-')}
                        </span>
                    </div>
                    <div className="calendar-icon-btn">
                        <Calendar size={20} />
                    </div>
                </div>
            </div>

            <div className="schedule-list">
                {(loading || swapLoading) ? (
                    <div className="loader-box"><div className="spinner"></div></div>
                ) : schedule.length > 0 ? (
                    schedule.map((item) => (
                        <div key={item.Schedule} className={`schedule-card ${item.Status === 'Not Held' ? 'border-red' : 'border-blue'}`}>
                            <div className="card-top">
                                <div className="course-info">
                                    <h3>{item["Course Name"]}</h3>
                                    <p className="class-detail">{`${item.Discipline}-${item.Semester}${item.Section}`}</p>
                                </div>
                                <div className={`status-badge ${item.Status === 'Not Held' ? 'badge-red' : 'badge-blue'}`}>
                                    <span className="dot"></span>
                                    {item.Status}
                                </div>
                            </div>

                            <div className="card-bottom">
                                <div className="time-venue">
                                    <div className="info-row">
                                        <Clock size={16} />
                                        <span>{`${item.Class_Start_Time}-${item.Class_End_Time}`}</span>
                                    </div>
                                    <div className="info-row">
                                        <MapPin size={16} />
                                        <span>{item.Venue}</span>
                                    </div>
                                </div>

                                <div className="action-area">
                                    {item.Status === "Not Held" ? (
                                        <button className="btn-reschedule" onClick={() => openDatePicker(item, "reschedule")}>Reschedule</button>
                                    ) : (
                                        <div className="popover-wrapper">
                                            <button className="btn-action" onClick={(e) => { e.stopPropagation(); toggleActionMenu(item.Schedule); }}>
                                                Action <ChevronDown size={16} />
                                            </button>
                                            {activeActionId === item.Schedule && (
                                                <div className="action-menu">
                                                    <button onClick={() => handleSwapClick(item)}>Swap Class</button>
                                                    <button onClick={() => openDatePicker(item, "preschedule")}>Pre-Schedule Class</button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data">No classes scheduled for this day.</div>
                )}
            </div>

            {showDatePickerModal && (
                <div className="modal-overlay">
                    <div className="date-picker-modal">
                        <div className="modal-header-simple">
                            <h3>Select Date</h3>
                            <button onClick={() => setShowDatePickerModal(false)}><X size={20} /></button>
                        </div>
                        <div className="modal-body-simple">
                            <input 
                                type="date" 
                                min={todayStr}
                                max={getMaxDate()}
                                value={activeItem ? tempDate : selectedDate}
                                onChange={(e) => activeItem ? setTempDate(e.target.value) : setSelectedDate(e.target.value)}
                                className="styled-date-input"
                            />
                        </div>
                        <div className="modal-footer-simple">
                            {activeItem ? (
                                <button className="confirm-btn" onClick={handleConfirm}>
                                    Confirm {operationType === "reschedule" ? "Reschedule" : "Pre-Schedule"}
                                </button>
                            ) : (
                                <button className="confirm-btn" onClick={() => setShowDatePickerModal(false)}>Apply Filter</button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {showSuccessModal && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <div className="success-header">
                            <div className="success-icon-circle"><CheckCircle size={32} color="white" /></div>
                            <h2>Success</h2>
                        </div>
                        <p className="success-msg">{modalMessage}</p>
                        
                        <div className="success-details">
                            {swapSuccessDetails ? (
                                <>
                                    <div className="swap-result-block">
                                        <p className="teacher-label">Requesting Teacher: {swapSuccessDetails.Requesting_Teacher_Detail["Teacher Name"]}</p>
                                        <div className="detail-item">
                                            <Clock size={16} color="#ff4d4d" />
                                            <span>New Slot: {swapSuccessDetails.Requesting_Teacher_Detail["New Class Time"]} at <MapPin size={14} color="#ff4d4d" style={{display:'inline'}}/> {swapSuccessDetails.Requesting_Teacher_Detail["New Venue"]}</span>
                                        </div>
                                    </div>
                                    <div className="swap-result-block" style={{marginTop: '15px'}}>
                                        <p className="teacher-label">Swapped Teacher: {swapSuccessDetails.Swapped_Teacher_Detail["Teacher Name"]}</p>
                                        <div className="detail-item">
                                            <Clock size={16} color="#ff4d4d" />
                                            <span>New Slot: {swapSuccessDetails.Swapped_Teacher_Detail["New Class Time"]} at <MapPin size={14} color="#ff4d4d" style={{display:'inline'}}/> {swapSuccessDetails.Swapped_Teacher_Detail["New Venue"]}</span>
                                        </div>
                                    </div>
                                </>
                            ) : modalDetails ? (
                                <>
                                    <div className="detail-item"><MapPin size={18} color="#ff4d4d" /><span>New Venue: {modalDetails.new_venue}</span></div>
                                    <div className="detail-item"><Calendar size={18} color="#ff4d4d" /><span>Date: {modalDetails.date}</span></div>
                                    <div className="detail-item"><Clock size={18} color="#ff4d4d" /><span>Time: {modalDetails.start_time} - {modalDetails.end_time}</span></div>
                                    <div className="detail-item"><Calendar size={18} color="#ff4d4d" /><span>Day: {modalDetails.day}</span></div>
                                </>
                            ) : null}
                        </div>
                        <button className="modal-ok-btn" onClick={() => setShowSuccessModal(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleChanges;