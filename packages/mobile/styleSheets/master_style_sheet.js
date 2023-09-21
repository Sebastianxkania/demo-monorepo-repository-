import {StyleSheet} from 'react-native';

const masterStyleSheet = StyleSheet.create({
    main_wrapper: {
        flex: 1,
    },

    // Normal input
    input: {
        borderColor: '#cacaca',
        backgroundColor : "#f7f7f7",
        paddingHorizontal: 15,
        paddingVertical: 17,
        
        borderRadius: 15,
        marginTop: 15,
        color: '#202124',
        borderWidth : 0.5,
    },
    
    
    // Noromal button 
    btn01: {
        backgroundColor: '#212121',
        width: '100%',
        padding: 17,
        borderRadius: 15,
        alignItems: 'center',
    },
    // Normal button text
    btn01_text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
    },


    input02_con: {
        marginTop: 15,
        width: '90%',
    },

    input02: {
        borderColor: '#cacaca',
        backgroundColor : "#f7f7f7",
        paddingHorizontal: 15,
        paddingVertical: 17,
        
        borderRadius: 9,
        
        color: '#202124',
        borderWidth : 0.5,
        height: 50,
    },

    // Noromal button 
    btn02: {
        backgroundColor: '#212121',
        width: '100%',
        borderRadius: 9,
        alignItems: 'center',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Normal button text
    btn02_text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
    },

    // Normal button container
    btn02_con: {
        marginTop: 15,
        width: '90%',
        
    },

    // Normal button container
    btn01_con: {
        width: '90%',
    },

    // Main con (Second above background)
    main_con: {
        flex: 1,
    
        alignItems: 'center',
        backgroundColor: '#fefefe',
      },

    // Header 02 (Second biggest)
    header02: {
        fontSize: 30,
        fontWeight: '300',
        color: '#202124',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
        paddingBottom: 5,
    },

    // Header 03 (Small)
    header03: {
        fontSize: 15,
        fontWeight: '400',
        color: '#202124',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
    },

    seperatorLine01: {
        height: 2,
        width: '90%',
        backgroundColor: '#eeeeef',
    },

    /////////////////////// Register page //////////////////////

    warning_msg_con: {
        paddingTop: 15,
        paddingBottom: 15,
        width: '90%',
    },

    header02_con: {
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 20,
        width: '100%',
      },
      
      input_con: {
        marginTop: 23,
        width: '90%',
      },
  
      next_btn_con: {
        width: '90%',
        marginBottom: 35,
      },


    lineSeperator01: {
        backgroundColor: '#dbdbdb',
        


        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        height: 0.5,

        flexDirection: 'row'
        
    },
})

module.exports = masterStyleSheet;
