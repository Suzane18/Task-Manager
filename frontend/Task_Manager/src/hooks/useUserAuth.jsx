import {useContext, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {UserContext} from '../context/userContext';

export const useUserAuth = () => {
    const {user,loading,clearUser} = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) return; // Wait until loading is completed
        if (user) return; // User is authenticated, no need to redirect
        if (!user){
            clearUser(); // Clear any existing user data
            navigate('/login'); // Redirect to login page
        }
    }, [user, loading,clearUser, navigate]);
        };
