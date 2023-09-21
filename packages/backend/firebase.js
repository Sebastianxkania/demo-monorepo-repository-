'use strict'


import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
//import React, { useState } from 'react';
//import { v4 as uuid } from 'uuid';
//import {NavigationActions, StackActions} from 'react-navigation';


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6z06LchAnWbzi5bm1q20iC8xyRzRDfqo",
    authDomain: "wetogether-baf67.firebaseapp.com",
    projectId: "wetogether-baf67",
    storageBucket: "wetogether-baf67.appspot.com",
    messagingSenderId: "975142553140",
    appId: "1:975142553140:web:e308a8cb51a5d3568f6c61"
  };

// Initialize Firebase
let app

if( firebase.apps.length === 0 ) {
    app = firebase.initializeApp(firebaseConfig);
}
else {
    app = firebase.app()
}
const fb = firebase;
const auth = firebase.auth()
const firestore = firebase.firestore()
const db = firestore;

export let image = null;
let uploading = false;

  

export const helloWorld = () => {
    return "mad man"
}

export const getAuth = () => {
    return auth
}

export const getFirestore = () => {
    return firestore
}

export const getFirebase = () => {
    return fb
}



// Handles login with email and password 
export const handleLogin = (email, password) => {
    return auth 
    .signInWithEmailAndPassword(email, password)
    .then(userCredentials => {
        const user = userCredentials.user;
        console.log('Logged in with ', user.email);
        let userId = user.uid
        //console.log(userId)
        storeData(userId)
        return userId
        
    })
    .catch(error => {
        alert(error.message)
        console.log('Invalid login');
        return null
    });

}

const storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@userId', value)
    } catch (e) {
      // saving error
    }
  }



export const handleSignOut = () => {
    return auth
    .signOut()
    .then(() => {
        //his.props.navigation.replace("Login")
        console.log('Logged out.');
        return true
    })
    .catch(error => {
        alert(error.message)
        return false
    })
}



export const getCurrentUid = async () => {
    const userId = await AsyncStorage.getItem('@userId')
    return userId
}


export const getCurrentUserDetails = () => {
    return db.collection('users')
    .doc(auth.currentUser?.uid)
    .get().then((user)=>{
        if(user.exists){
            // now you can do something with user
            console.log()
            return user.data()
        }
        else {
            console.log("User doesn't exist")
            return null
        }
    })
}

export const getUserDetailsByID = (userID) => {
    return db.collection('users')
    .doc(userID)
    .get().then((user)=>{
        if(user.exists){
            // now you can do something with user
            console.log()
            return user.data()
        }
        else {
            console.log("User doesn't exist")
            return null
        }
    })
}

export const getUserByUserID = (userID) => {
    return db.collection('users')
    .doc(userID)
    .get().then((user)=>{
        if(user.exists){
            // now you can do something with user
            console.log()
            return user.data()
        }
        else {
            console.log("User doesn't exist")
            return null
        }
    })
}

export const usernameExists = (username) => {
    return db.collection('users').where("username", "==", username).get()
    .then(function(querySnapshot) {
        if (querySnapshot.empty) {
           return false;
        } else {
           return true;
        } 
    })
    .catch(error => {
        return error.message;
    });
}

export const emailExists = (email) => {
    return db.collection('users').where("email", "==", email).get()
    .then(function(querySnapshot) {
        if (querySnapshot.empty) {
           return false;
        } else {
           return true;
        } 
    })
    .catch(error => {
        return error.message;
    });
}

export const getUserByUsername = (usrname) => {
    const username = usrname.toLowerCase()

    return db.collection('users').where("username", "==", username).get()
        .then((querySnapshot) => {
            let user = null
            querySnapshot.forEach((doc) => {
                user = doc
                //console.log(doc.id, " => ", doc.data());
                
            });

            if (user == null) {
                alert("This username doesn't exist")
            }

            return user
        })
}

export const createFollowingAndFollowerDocument = async (followerID, followingID) => {        
    if (followerID != followingID || followingID != followerID) {
        const userRef = firestore.doc(`users/${followerID}/following/${followingID}`);
        const snapshot = await userRef.get();
        const userRef2 = firestore.doc(`users/${followingID}/followers/${followerID}`);
        const snapshot2 = await userRef.get();

        if (!snapshot.exists) {    
            try {
                userRef.set({});
                console.log("User: ", followingID, " followed")
                
            } catch (error) {
            console.log('[ERROR] Error in adding following', error)
            }
        }
        else {
            console.log("[ERROR] Duplicated following. following was not added.")
        }

        if (!snapshot2.exists) {    
            try {
                userRef2.set({});
                
            } catch (error) {
            console.log('[ERROR] Error in adding follower', error)
            }
        }
        else {
            console.log("[ERROR] Duplicated follower. Follower was not added.")
        }
    }
    else {
        console.log("[ERROR] Following cannot be follower or vice versa")
        return
    }
}

export const createFollowingCollection_AND_addCurrentUserIDToIt = async (currentUserID) => {        
    const userRef = firestore.doc(`users/${currentUserID}/following/${currentUserID}`);
    const snapshot = await userRef.get();

    if (!snapshot.exists) {    
        try {
            userRef.set({});
            
        } catch (error) {
        console.log('[ERROR] Error in adding following', error)
        }
    }
    else {
        console.log("[ERROR] Duplicated following. following was not added.")
    }
}
  
export const getFollowing = async (followerID) => {
    
    const querySnapshot = await db.collection('users').doc(followerID).collection('following').limit(1).get()

    if (querySnapshot.empty) {
        return null
    }
    else {
        const followingData = await db.collection('users').doc(followerID).collection('following')
    
        return followingData.get().then((querySnapshot) => {
            const followingDoc = []
    
            querySnapshot.forEach((doc) => {
                followingDoc.push({ id: doc.id })
            })
            return followingDoc
            
        })
    }

}

export const followed = async (followerID, followingID) => {

    return getFollowing(followerID).then((result) => {

        if (result == null) {
            // Following collection doesn't exist
            // Following collection gets created when user follows their first follower
            return false
        }
        else if (followerID == followingID) {
            // Following is follower
            return null
        }
        else {
            // Follower has a following collection
            // Following is searched in the following collection

            let followingIDExistsInFollowing = false

            result.forEach((doc) => {
                if (doc.id == followingID) {
                    followingIDExistsInFollowing = true
                }
            })

            return followingIDExistsInFollowing
            
        }
    })
    
}



/////////////// SIGN UP ///////////////

const createUserDocument = async (user, usrname, fname, lname) => {
    if (!user) return;
  
    const userRef = firestore.doc(`users/${user.uid}`);
    const snapshot = await userRef.get();
    
    if (!snapshot.exists) {
      const username = usrname;
      const email = user.email;
      const firstName  = fname;
      const lastName = lname;
      const bio = ""
      const profileImageURL = 'https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/profile_images%2Fblank-profile-image.jpg?alt=media&token=1e68e0fb-3f5b-466c-a016-826d7f0b1f42'
    
      try {
        userRef.set({
          username,
          email,
          firstName,
          lastName,
          bio,
          profileImageURL,
  
        });
      } catch (error) {
        console.log('Error in creating user', error)
      }
    }
  
  }
  
export const handleSignUp = (username, email, fname, lname, password) => {
    return auth
     .createUserWithEmailAndPassword(email, password)
     .then(userCredentials => {
         const user = userCredentials.user;
         createUserDocument(user, username, fname, lname)
         createFollowingCollection_AND_addCurrentUserIDToIt(user.uid)
         storeData(user.uid)
         console.log('Registered with', user.email);
         return user.uid
    
     })
     .catch(error => {
        console.log(error.message)
        return null
    })
}


export const getImage = async () => {
    return image
}

export const updateFirstName = async (userID, newFirstName) => {
    
    
    const docRef = db.collection('users').doc(userID)

    docRef
    .update({
        firstName: newFirstName,
    })
    .then(() => {
        alert("First name was updated.");
    })
    .catch((e) => {

    })
}

export const updateLastName = async (userID, newLastName) => {
    
    
    const docRef = db.collection('users').doc(userID)

    docRef
    .update({
        lastName: newLastName,
    })
    .then(() => {
        alert("Last name was updated.");
    })
    .catch((e) => {

    })
}

export const updateBio = async (userID, newBio) => {
    
    
    const docRef = db.collection('users').doc(userID)

    docRef
    .update({
        bio: newBio,
    })
    .then(() => {
        alert("Bio was updated.");
    })
    .catch((e) => {

    })
}

export const passwordReset = async (email) => {
    
    return auth.sendPasswordResetEmail(email)
    .then(() => {
        alert("A reset password link was sent to your email. Please follow the steps to reset your password")
        return true
    })
    .catch(error => {
        alert(error.message)
        return false
        

    });
}



