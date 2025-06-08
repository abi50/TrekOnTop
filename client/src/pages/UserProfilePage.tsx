import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { RootState } from "../reduxs/store";
import EditProfileModal from "../components/EditProfileModal";
import PasswordVerificationModal from "../components/PasswordVerificationModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ExportUserDataModal from "../components/ExportUserDataModal";
import DeleteAccountModal from "../components/DeleteAccountModal";
import UserMenu from "../components/UserMenu";
import "../styles/UserProfilePage.css";

const UserProfilePage = () => {
    const user = useSelector((state: RootState) => state.user);
    const [profileImageUrl, setProfileImageUrl] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [verifyPasswordModal, setVerifyPasswordModal] = useState(false);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [places, setPlaces] = useState<any[]>([]);
    const [imagesByReco, setImagesByReco] = useState<Record<number, any[]>>({});
    const [currentImageIndex, setCurrentImageIndex] = useState<Record<number, number>>({});
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [showExportData, setShowExportData] = useState(false);
    const [showDeleteAccount, setShowDeleteAccount] = useState(false);

    useEffect(() => {
        if (!user || !user.user) return;
        const fetchProfileImage = () => {
            setProfileImageUrl(`https://localhost:7083/api/User/getimage/${user.user?.id}`);
        };


        const fetchRecommendations = async () => {
            try {
                const res = await axios.get("https://localhost:7083/api/Recommendation");
                const userRecs = res.data.filter((r: any) => r.userId === user.user?.id);
                setRecommendations(userRecs);

                const imageMap: Record<number, any[]> = {};
                const imageIndexMap: Record<number, number> = {};

                await Promise.all(userRecs.map(async (rec: any) => {
                    try {
                        const imgRes = await axios.get(`https://localhost:7083/api/Recommendation/${rec.recoId}/images`);
                        imageMap[rec.recoId] = imgRes.data;
                        imageIndexMap[rec.recoId] = 0;
                    } catch (e) {
                        imageMap[rec.recoId] = [];
                        imageIndexMap[rec.recoId] = 0;
                    }
                }));

                setImagesByReco(imageMap);
                setCurrentImageIndex(imageIndexMap);
            } catch (e) {
                console.error("שגיאה בטעינת המלצות", e);
            }
        };

        const fetchPlaces = async () => {
            try {
                const res = await axios.get("https://localhost:7083/api/Place");
                setPlaces(res.data);
            } catch (e) {
                console.error("שגיאה בטעינת מקומות", e);
            }
        };

        fetchProfileImage();
        fetchRecommendations();
        fetchPlaces();
    }, [user]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => {
                const updated: Record<number, number> = { ...prev };
                for (const recoId in imagesByReco) {
                    const images = imagesByReco[recoId];
                    if (images && images.length > 1) {
                        updated[recoId] = (prev[recoId] + 1) % images.length;
                    }
                }
                return updated;
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [imagesByReco]);

    if (!user || !user.user) {
        return <div className="wallet-style">משתמש לא מחובר</div>;
    }

    const sortedRecommendations = [...recommendations].sort((a, b) => a.placeId - b.placeId);

    const handleEditClick = () => {
        setVerifyPasswordModal(true);
    };

    const handleVerified = () => {
        setVerifyPasswordModal(false);
        setShowModal(true);
    };

    return (
        <div className="wallet-style">
            {/* <div className="user-menu-wrapper"> */}
            {/* <UserMenu
                    profileImage={profileImageUrl}
                    name={user.user.name}
                    email={user.user.email}
                    onEdit={handleEditClick}
                    onChangePassword={() => setShowChangePassword(true)}
                    onExport={() => setShowExportData(true)}
                    onDelete={() => setShowDeleteAccount(true)}
                /> */}
            {/* </div> */}

            <div className="user-card">
                <div className="user-main">
                    <img src={profileImageUrl} className="profile-pic" alt="Profile" />
                    <div className="user-details">
                        <div className="info-line"><span>                        
                            <img src="/icons/profile.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
                        </span> {user.user?.name}</div>
                        <div className="info-line"><span>                        
                            <img src="/icons/email.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
                        </span> {user.user?.email}</div>
                        <div className="info-line"><span>                        
                            <img src="/icons/key.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
                        </span> הסיסמה שלך שמורה בצורה מאובטחת</div>
                    </div>
                </div>

                <div className="user-actions">
                    <button onClick={handleEditClick}>        
                        <img src="/icons/edit-profile.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
                    עריכת פרופיל</button>
                    <button onClick={() => setShowChangePassword(true)}>
                    <img src="/icons/password1.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />

                         שינוי סיסמה</button>
                    <button onClick={() => setShowExportData(true)}>
                    <img src="/icons/download.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />

                        ייצוא נתונים</button>
                    <button onClick={() => setShowDeleteAccount(true)}>                    
                        <img src="/icons/trash.png" alt="popular places" style={{ width: 24, verticalAlign: 'middle', marginLeft: 5 }} />
                    מחיקת חשבון</button>
                </div>
            </div>

            {verifyPasswordModal && (
                <PasswordVerificationModal token={user.token!} onSuccess={handleVerified} onClose={() => setVerifyPasswordModal(false)} />
            )}
            {showModal && (
                <EditProfileModal user={{ id: user.user.id, name: user.user.name, email: user.user.email, token: user.token! }} onClose={() => setShowModal(false)} />
            )}
            {showChangePassword && (<ChangePasswordModal token={user.token!} onClose={() => setShowChangePassword(false)} />)}
            {showExportData && (<ExportUserDataModal token={user.token!} onClose={() => setShowExportData(false)} />)}
            {showDeleteAccount && (<DeleteAccountModal userId={user.user.id} token={user.token!} onClose={() => setShowDeleteAccount(false)} />)}

            <h3 className="recommendations-title">ההמלצות שלי</h3>
            <div className="recommendation-list">
                {sortedRecommendations.length === 0 ? (
                    <div className="no-recommendations">עוד לא פרסמת המלצות. הזמן לגלות מקומות ולשתף!</div>
                ) : (
                    sortedRecommendations.map((rec: any) => {
                        const place = places.find(p => p.placeId === rec.placeId);
                        const images = imagesByReco[rec.recoId] || [];
                        const currentIndex = currentImageIndex[rec.recoId] || 0;
                        return (
                            <div key={rec.recoId} className="recommendation-card">
                                <h4>{rec.title}</h4>
                                <p>{rec.description}</p>
                                <p className="place-name">מקום: {place?.placeName || "לא ידוע"}</p>
                                {images.length > 0 && (
                                    <div className="slider">
                                        <img className="slider-image" src={`https://localhost:7083/api/Image/getimage/${images[currentIndex].imageId}`} alt="המלצה" />
                                        <img className="arrow left" src="/images/left-arrow.png" onClick={() => setCurrentImageIndex(prev => ({ ...prev, [rec.recoId]: (currentIndex - 1 + images.length) % images.length }))} />
                                        <img className="arrow right" src="/images/right-arrow.png" onClick={() => setCurrentImageIndex(prev => ({ ...prev, [rec.recoId]: (currentIndex + 1) % images.length }))} />
                                    </div>
                                )}
                                <div className="likes">
                                    <span className="like">👍 {rec.likes}</span>
                                    <span className="dislike">👎 {rec.dislikes}</span>
                                </div>
                                <button onClick={() => {
                                    localStorage.setItem("editRecommendation", JSON.stringify({ ...rec, placeName: place?.placeName || "לא ידוע" }));
                                    window.location.href = "/editReco";
                                }}>ערוך המלצה</button>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default UserProfilePage;
