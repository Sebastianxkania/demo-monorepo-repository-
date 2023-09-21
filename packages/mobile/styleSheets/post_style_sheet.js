import {StyleSheet} from 'react-native';

const postStyleSheet = StyleSheet.create({

    post_main_con: {
        
        //backgroundColor: '#fefefe',
        backgroundColor: '#fefefe',
        marginBottom: 15,

    },

    post_top_con: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',

        height: 40,
    },

    post_top_left_con: {
        width: '11%',
        height: "100%",

    },


    post_profile_img: {
        borderRadius: 50,

        width: 360/9,
        height: 360/9,
    },

    post_top_right_con: {
        width: '89%',
        height: '100%',

        justifyContent: 'center',
        flex: 1,
        
    },

    post_username_txt: {
        marginLeft: 13,

        fontSize: 17,
        fontWeight: '500',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'left', 
    },

    post_img_con: {
        marginTop: 10,
        height: 390,
    },

    post_img: {
        height: '100%',
        width: '100%',
    },

    ////////// POST COMMENTS TAB //////////

    post_btns_con: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
        flexDirection: 'row',

        
        height: 45,
    },

    post_comment_btn: {
        width: '16%',
        height: "100%",
    },

    post_view_comments_con: {
        height: '100%',
        width: '84%',

        justifyContent: 'center',
        flex: 1,
    },

    post_view_comments_txt: {
        marginRight: 15,
        fontSize: 13,
        fontWeight: '400',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'right', 
    },

    post_description_con: {
        backgroundColor: '#fefefe',
        //height: 50,
    },

    post_description_txt_con: {
        height: '100%',

        flex: 1,
    },

    post_description_txt: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,

        fontSize: 13,
        fontWeight: '400',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'left', 
    },






    post_interests_con: {
        alignItems: 'center',
        backgroundColor: '#fefefe',

        flexDirection: 'row',

        
        height: 40,
    },

    post_interests_text_con: {
        //backgroundColor: 'black',
        borderColor: '#0195f6',
        borderWidth : 1,
        marginTop: 5,
        marginLeft: 15,
        marginBottom: 10,
        borderRadius: 10,
    },  

    post_interests_text: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0195f6',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',


        
        marginTop: 2,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10,
    },

    btns_con: {
        width: '90%',
        marginTop: 15,
    },


})

module.exports = postStyleSheet;