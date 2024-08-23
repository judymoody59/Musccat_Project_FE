// src/contexts/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem("authTokens")
            ? JSON.parse(localStorage.getItem("authTokens"))
            : null
    );
    const [user, setUser] = useState(() =>
        localStorage.getItem("authTokens")
            ? jwtDecode(JSON.parse(localStorage.getItem("authTokens")).access)
            : null
    );
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(!!authTokens);

    // benefit information
    const [benefitInfos, setBenefitInfos] = useState({});

    const [scholarships, setScholarships] = useState([]);
    const [likes, setLikes] = useState([]);

    const navigate = useNavigate();

    const fetchUserData = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/users/mypage/", {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
            });
            setUser({
                username: response.data.username,
                fullName: response.data.fullname,
                userNickname: response.data.nickname,
                userBirthdate: response.data.birth,
                email: response.data.email,
                region: response.data.region,
                district: response.data.district,
                incomeBracket: response.data.incomeBracket,
                applicantCategory: response.data.applicantCategory,
                school: response.data.school,
                major: response.data.major,
                year: response.data.year,
                semester: response.data.semester,
                currentGPA: response.data.currentGPA,
                totalGPA: response.data.totalGPA,
                familyStatus: response.data.familyStatus,
                additionalInfo: response.data.additionalInfo,
            });
        } catch (error) {
            console.error("Failed to fetch user data", error);
        }
    };

    const updateUser = async (updatedData) => {
        try {
            const response = await axios.put("http://127.0.0.1:8000/users/mypage/", updatedData, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
            });
            if (response.status === 200) {
                setUser({
                    ...user,
                    ...updatedData
                });
                await fetchUserData(); // 변경된 데이터로 사용자 정보 갱신
            } else {
                alert("사용자 정보를 업데이트하는 데 실패했습니다.");
            }
        } catch (error) {
            console.error("사용자 정보 업데이트 중 오류 발생", error);
        }
    };
    const fetchFoundations = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/beneinforegister/", {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch foundations", error);
            return [];
        }
    };

    const fetchScholarshipsByFoundation = async (foundationName) => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/beneinforegister/${foundationName}/`, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error("Failed to fetch scholarships by foundation", error);
            return [];
        }
    };

    const fetchScholarships = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/entirescholar/");
            setScholarships(response.data);
            setLikes(Array(response.data.length).fill(false));  // 좋아요 상태 초기화
        } catch (error) {
            console.error("Failed to fetch scholarships", error);
        }
    };
    
    const loginUser = async (username, password) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/users/login/", {
                username,
                password
            });

            if (response.status === 200 && response.data.access) {
                setAuthTokens(response.data);
                localStorage.setItem("authTokens", JSON.stringify(response.data));
                await fetchUserData();  // Fetch and set the full user data after login
                setIsAuthenticated(true);
                navigate("/main");
            } else {
                alert("로그인에 실패했습니다. 서버 응답을 확인하세요.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            alert("로그인 중 오류가 발생했습니다. 서버 상태를 확인하세요.");
        }
    };

    const registerUser = async (username, password, password2, fullName, userNickname, userBirthdate, email) => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/users/register/", {
                username,
                password,
                password2,
                nickname: userNickname,
                birth: userBirthdate,
                fullname: fullName,
                email: email
            });

            if (response.status === 201) {
                navigate("/users/login");
            } else {
                alert("회원가입에 실패했습니다!");
            }
        } catch (error) {
            console.error("Failed to register user", error);
            alert("회원가입 중 오류가 발생했습니다. 서버 상태를 확인하세요.");
        }
    };

    const addBenefitInfo = async (product_id, info) => {
        try {
            const response = await axios.post(`http://127.0.0.1:8000/benefitinfo/${product_id}/`, info, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
            });
    
            if (response.status === 201) {
                setBenefitInfos(prevState => ({
                    ...prevState,
                    [product_id]: [...(prevState[product_id] || []), response.data]
                }));
            }
        } catch (error) {
            console.error("Failed to add benefit information:", error);
        }
    };

    /*
    const mypageUser = async (fullName, userNickname, userBirthdate) => {
        try {
            const response = await axios.put("http://127.0.0.1:8000/users/mypage/", {
                fullName,
                nickname: userNickname,
                birth: userBirthdate,
            }, {
                headers: {
                    Authorization: `Bearer ${authTokens.access}`
                }
            });

            if (response.status === 200) {
                // Update user state with new data
                await fetchUserData();  // Refetch user data to update the state
                alert("User details updated successfully!");
            } else {
                alert("Failed to update user details.");
            }
        } catch (error) {
            console.error("Failed to update user details", error);
            alert("Updating user details failed. Please check the server status.");
        }
    };
    */

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem("authTokens");
        setIsAuthenticated(false);
        navigate("/");
    };

    useEffect(() => {
        if (authTokens) {
            fetchUserData();
            fetchScholarships();
        }
        setLoading(false);
    }, [authTokens]);


    const contextData = {
        user,
        authTokens,
        loginUser,
        registerUser,
        fetchUserData,
        updateUser,
        logoutUser,
        isAuthenticated,
        addBenefitInfo,
        benefitInfos,
        scholarships,
        likes,
        setLikes,
        fetchScholarships,
        fetchFoundations,
        fetchScholarshipsByFoundation,
    };

/*
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = () => setIsAuthenticated(true);
    const logout = () => setIsAuthenticated(false);
*/

    return (
        <AuthContext.Provider value={contextData}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);