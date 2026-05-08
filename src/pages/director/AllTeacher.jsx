import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Clock, MapPin, BookOpen, User } from 'lucide-react';
import './AllTeacher.css';

const AllTeacher = () => {
    const BASE_URL = "http://localhost:8000";
    const [allTeachers, setAllTeachers] = useState([]);
    const [busyTeachers, setBusyTeachers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [resAll, resBusy] = await Promise.all([
                axios.get(`${BASE_URL}/director/getAllTeachers`),
                axios.get(`${BASE_URL}/director/getBusyTeachers`)
            ]);
            setAllTeachers(resAll.data);
            setBusyTeachers(resBusy.data);
        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setLoading(false);
        }
    };

    const getFullImageUrl = (picPath) => {
        if (!picPath) return 'https://ui-avatars.com/api/?background=random&color=fff&name=Teacher';
        if (picPath.startsWith('http')) return picPath;
        const cleanPath = picPath.replace(/\\/g, '/');
        return `${BASE_URL}/${cleanPath.startsWith('/') ? cleanPath.substring(1) : cleanPath}`;
    };

    const busyIds = new Set(busyTeachers.map(bt => bt.Teacher_Id));
    const freeTeachers = allTeachers.filter(t => !busyIds.has(t.User_ID));

    const filteredBusy = busyTeachers.filter(t => 
        t.Teacher_Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFree = freeTeachers.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="teachers-page-container">
            <div className="search-section-premium">
                <div className="search-bar-wrapper">
                    <Search className="search-icon-web" size={20} />
                    <input 
                        type="text" 
                        placeholder="Search teacher by name..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="teachers-content-scroll">
                <div className="section-title-wrapper">
                    <h2 className="status-heading busy">Currently in Class</h2>
                    <span className="count-badge">{filteredBusy.length}</span>
                </div>
                
                <div className="teachers-grid">
                    {filteredBusy.map((teacher, index) => (
                        <div key={index} className="teacher-card busy-premium-card">
                            <div className="card-top-info">
                                <div className="teacher-image-wrapper">
                                    <img 
                                        src={getFullImageUrl(teacher.Profile_Pic)} 
                                        alt={teacher.Teacher_Name} 
                                        className="profile-img-main"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "https://ui-avatars.com/api/?background=0066ff&color=fff&name=" + teacher.Teacher_Name;
                                        }}
                                    />
                                    <div className="busy-pulse"></div>
                                </div>
                                <div className="name-course-box">
                                    <h3>{teacher.Teacher_Name}</h3>
                                    <p className="course-highlight">{teacher.Course_Name}</p>
                                </div>
                            </div>
                            
                            <div className="busy-details-grid">
                                <div className="detail-item">
                                    <BookOpen size={16} />
                                    <span>{teacher.Discipline} ({teacher.Semester}-{teacher.Section})</span>
                                </div>
                                <div className="detail-item">
                                    <Clock size={16} />
                                    <span>{teacher.Class_Start_Time} - {teacher.Class_End_Time}</span>
                                </div>
                                <div className="detail-item">
                                    <MapPin size={16} />
                                    <span>{teacher.Venue_Id}</span>
                                </div>
                                <div className="detail-item day-tag">
                                    <span>{teacher.Day}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="section-title-wrapper mt-40">
                    <h2 className="status-heading free">Free Teachers</h2>
                    <span className="count-badge grey">{filteredFree.length}</span>
                </div>

                <div className="free-teachers-list">
                    {filteredFree.map((teacher, index) => (
                        <div key={index} className="free-teacher-row">
                            <div className="free-profile-circle">
                                <img 
                                    src={getFullImageUrl(teacher.pic)} 
                                    alt={teacher.name} 
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://ui-avatars.com/api/?background=cccccc&color=fff&name=" + teacher.name;
                                    }}
                                />
                            </div>
                            <span className="free-teacher-name">{teacher.name}</span>
                            <div className="available-tag">Available</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllTeacher;