'use strict'
import firebase from 'firebase';
import { getAuth, getFirestore, getFirebase, getUserByUserID}  from "backend/firebase";
import { v4 as uuid } from 'uuid';
import React from 'react';

export default class PostController extends React.Component {
    static image = null;
    static uploading = false;
    static currentCommenter = null
    static uploadingProgress = 0
    static postDetails = null
    static isBlob = null 

    constructor(props) {
        super(props)
        this.state = {
            fb : getFirebase(),
            auth : getAuth(),
            fs : getFirestore(),
            image : '',
            uploading : null,
            documentUploading : null,
            
        }
    }
    printCurrentEmail = () => {

        console.log(this.state.auth.currentUser?.email)
    }

    getUploadingProgress = () => {
        return this.uploadingProgress
    }

    getUserByUserID = (userID) => {
        return this.state.fs.collection('users')
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

    createPostDocument = async (usrID, pDescription, pImageUrl) => {
        //if (!this.user) return;

        return this.getUserByUserID(usrID).then( async (user) => {

            const postID = uuid()
            const userRef = this.state.fs.doc(`users/${usrID}/posts/${postID}`);
            const snapshot = await userRef.get();
            
            if (!snapshot.exists) {
              const userID = usrID;
              const postUsername = user.username
              const postUserProfileImageURL = user.profileImageURL
              const postDescription = pDescription;
              const postImageUrl = pImageUrl

            
                try {
                    userRef.set({
                        userID,
                        postUsername,
                        postDescription,
                        postImageUrl,
                        postUserProfileImageURL,
                    
                    }); 
                    
                    return true
                    
                } catch (error) {
                console.log('Error in creating post', error)
                return false
                }
            }
            else {
                console.log("[ERROR] Duplicated post. Post was not created.")
                return false
            }
        })
        

      
    }

    getAllUsersPosts = () => {
        this.state.fs.collection('users')
        .doc(auth.currentUser?.uid)
        .get().then((user)=>{
            if(user.exists){
                console.log()
                 console.log(user.data())
            }
            else {
                console.log("User doesn't exist")
                
            }
        })
    }

    getCurrentUserDetails = () => {
        return this.state.fs.collection('users')
        .doc(this.auth.currentUser?.uid)
        .get().then((user)=>{
            if(user.exists){
                console.log()
                return user.data()
            }
            else {
                console.log("User doesn't exist")
                return null
            }
        })
    }

    getPostDetails = () => {
        this.state.fs.collection('users')
        .doc(this.auth.currentUser?.uid)
        .collection('posts')
        .doc('506fdb83-bfc5-48f5-b4ce-0eb92a709fd6')
        .get()
        .then((doc) => {
          console.log(doc.data());
        });
    }

    getPostDetails2 = () => {
        this.state.fs.collection('users').doc('posts').collection('111').get()
            .then((snap) => {
            snap.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            });
            });
    }

    async getAllUserPostsByUserID(userID) {
        const postsData = await this.state.fs.collection('users').doc(userID).collection('posts')
        
        
        return postsData.get().then((querySnapshot) => {
            const postsDoc = []

            querySnapshot.forEach((doc) => {
                postsDoc.push({ id: doc.id, ...doc.data() })
                //console.log(doc.data().postDescription)
            })
            return postsDoc
        })
    }

    getUploading = () => {
        return this.uploading
    }

    async handleSelectedImage_AND_handlePostCreation(postDetails) {
        try {
            this.state.uploading = true;
    
            await this.uploadImage_AND_handlePostCreation(postDetails)
        } 
        catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } 
        finally {
            this.state.uploading = false;
        }
    }

    handlePostCreation = (postDetails) => {
        

        if (postDetails.selectedImage == null) {
            this.createPostDocument(postDetails.currentUserID, postDetails.postDescription, null).then((created) => {
                if (created = true) {
                    alert("Post was uploaded, Refresh to view it.");
                }else {

                }
            })
        }
        else {
            this.handleSelectedImage_AND_handlePostCreation(postDetails)
        }
    }


    
    uploadImage_AND_handlePostCreation = async (pDetails) => {
        
        this.postDetails = pDetails
        const uri = this.postDetails.selectedImage.uri
        
        this.uploading = true;
        
        if (this.postDetails.isBlob == false) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                  console.log(e);
                  reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });

            this.handleUploadTask(blob)
        }
        else if (this.postDetails.isBlob == true) {
            this.handleUploadTask(this.postDetails.selectedImage)
        }
    }

    handleUploadTask = async (b) => {
        const blob = b
        const imgID = uuid()
        var storageRef = this.state.fb.storage().ref();

        var uploadTask = storageRef.child(`images/${imgID}`).put(blob);
    
        uploadTask.on(this.state.fb.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                console.log(this.uploading)
       
            },
            (error) => {
                
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                console.log("Upload completed successfully, now we can get the download URL");
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.image = downloadURL
                    this.uploading = false
                    console.log(this.uploading)

                    // Post is created with the uploaded image URL

                    this.createPostDocument(this.postDetails.currentUserID, this.postDetails.postDescription, downloadURL).then((created) => {
                        if (created = true) {
                            alert("Post was uploaded, Refresh to view it.");
                        }else {
                            
                        }
                    })

                });
            }
        )
    }
   


    ////////// COMMENTS //////////

    createCommentDocument = async (commenterUsrID, postUsrID, postID, commentTxt) => {
        //if (!this.user) return;

        const commentID = uuid()
        const userRef = this.state.fs.doc(`users/${postUsrID}/posts/${postID}/comments/${commentID}`);
        const snapshot = await userRef.get();
        
        if (!snapshot.exists) {
            return getUserByUserID(commenterUsrID).then((currentCommenterOBJ) => {
                const currentCommenter = currentCommenterOBJ
                const commenterUserID = commenterUsrID;
                const commenterUsername = currentCommenter.username
                const commentText = commentTxt;
                //const 
                
                this.state.documentUploading = true;
                console.log(this.state.documentUploading)
            
                try {
                    userRef.set({
                        commenterUserID,
                        commenterUsername,
                        commentText,
    
                    });
                    return true
                    
                } 
                catch (error) 
                {
                console.log('Error in creating comment', error)
                return false
                }
                finally {
                    this.state.documentUploading = false;
                }
            })
            


        }
        else {
            console.log("[ERROR] Duplicated comment. Comment was not created.")
        }
      
    }

    getCocumentUploading = async () => {
        return this.state.documentUploading
    }

      
    async getAllCommentsByPostUserIDAndPostId(PostUsrID, postID) {
        const commentsData = await this.state.fs.collection('users').doc(PostUsrID).collection('posts').doc(postID).collection('comments')
        
        
        return commentsData.get().then((querySnapshot) => {
            const commentsDoc = []

            querySnapshot.forEach((doc) => {
                commentsDoc.push({ id: doc.id, ...doc.data() })
                //console.log(doc.data().postDescription)
            })
            return commentsDoc
        })
    }


    getAllFollowingIDs = async (userID) => {

        const querySnapshot = await this.state.fs.collection('users').doc(userID).collection('following').limit(1).get()
    
        if (querySnapshot.empty) {
            return null
        }
        else {
            const followingData = await this.state.fs.collection('users').doc(userID).collection('following')
        
            return followingData.get().then((querySnapshot) => {
                const followingDoc = []
        
                querySnapshot.forEach((doc) => {
                    followingDoc.push({ id: doc.id })
                })
                return followingDoc
                
            })
        }
    
    }     



    handleProfileImageUpdate = async (userID, uri, isBlob) => {
        
        try {
            this.state.uploading = true;
    
            await this.uploadImage(userID, uri, isBlob)
        } 
        catch (e) {
            console.log(e);
            alert("Upload failed, sorry :(");
        } 
        finally {
            this.state.uploading = false;
        }
    }
    
    uploadImage = async (userID, uri, isBlob) => {
        
        this.uploading = true;
    
        if (isBlob == false) {
            const blob = await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.onload = function () {
                  resolve(xhr.response);
                };
                xhr.onerror = function (e) {
                  console.log(e);
                  reject(new TypeError("Network request failed"));
                };
                xhr.responseType = "blob";
                xhr.open("GET", uri, true);
                xhr.send(null);
            });
            
            this.handleUploadImage(blob, userID)
        }
        else if(isBlob == true) {
            this.handleUploadImage(uri, userID)
        }
    }


    handleUploadImage = async (blob, userID) => {
        var storageRef = this.state.fb.storage().ref();
        const imgID = uuid()
        var uploadTask = storageRef.child(`profile_images/${imgID}`).put(blob);
    
        uploadTask.on(this.state.fb.storage.TaskEvent.STATE_CHANGED,
            (snapshot) => {
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                this.uploadingProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                console.log(this.uploading)
       
            },
            (error) => {
                
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                console.log("Upload completed successfully, now we can get the download URL");
                uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    this.image = downloadURL
                    this.uploading = false
                    console.log(this.uploading)
    
    
                    this.updateProfileImage(userID, downloadURL)
                    this.uploadingProgress = 0
                });
            }
        )
    }


    updateProfileImage = async (userID, newURL) => {
    
    
        const docRef = this.state.fs.collection('users').doc(userID)
    
        docRef
        .update({
            profileImageURL: newURL,
        })
        .then(() => {
            alert("Profile Image was updated.");
        });
    }
    
    sum =  (a, b) => {
        return a + b;
    
    }
    
}





export let pc = new PostController();