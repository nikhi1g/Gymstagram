import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { firestore } from '../firebase'; // Ensure this import is correct
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import './home_page.css';
import '../App.css';
import './create_post.js';


function HomePage() {

  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]); // State for users
  
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const uid = user.uid;
        fetchProfile(uid);
        fetchUsers(); // Fetch users
      } else {
        console.log("No user is currently signed in.");
        // Optionally, navigate to the login page here
      }
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  const fetchProfile = async (uid) => {
    const docRef = doc(firestore, "profiles", uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setCurrentUser(docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  // Fetch users from Firestore
  const fetchUsers = async () => {
    try {
      const usersColRef = collection(firestore, "profiles"); // Adjust the collection path as needed
      const usersSnapshot = await getDocs(usersColRef);
      const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("Fetched Users:", usersList); // Debug: Log fetched users
      setUsers(usersList);
    } catch (error) {
      console.error("Error fetching users:", error); // Log any errors
    }
  };
  

  const handleProfileClick = () => {
    navigate('/profile-page');
  };
  return (
    <div>
      <button className="fancy-button" onClick={handleProfileClick}>
        View Profile
      </button>
      <h1>postGrid</h1>
      <div>

      <button className="fancy-post-button" onClick={() => {navigate('/create')}}> &#10133; </button>
      </div>
      <h1>Users</h1>
      <div style={{ textAlign: 'left' }}>
        <ul style={{ listStyleType: 'none' }}>
          {users.map((user) => (
          <li key={user.id}>{user.profile_picture} | {user.User_Name} | {user.id} | {user.bio}</li>
         ))}
        </ul>
      </div>

    </div>

  );
}

export default HomePage;