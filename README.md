# COM3504
##System Overview
This is a system that allows users to exchange information using images and texts. For the system to work they have to 
join the same session by entering the same room number and image. This ensures secrecy amongst the users. 

##System features
Users can upload 
an image to be used to join a room or they can use a common image. Users can annotate the images to give extra infomration
about them. This includes directions to follow if information being given is about a certain location or to  give more information about a person on the image. Extra 
information can be added to the annotation by use of the Google search bar that can be found on the right of the image once a user annotates an image.

##Installation
To download the tool, you will need to clone the repository by running the command below in the terminal window: </br>
```git clone https://github.com/cmoynihan221/COM3504.git```
</br>
The instructions that follow expect that you run the program in IntelliJ. 
1. Add a configuration, to be able to run the app. 
This you can do by clicking the 'Add Configuration'. 
   
2. Click on the + icon and add 'Node.js'. 
   
3. In the form that follows in the JavaScript file 
field,click on the folder icon and navigate to 'Solution\bin\www'.
   
4. For the environment variables field, fill in 'DEBUG=week-3.c-socket.io-chat:*'

5. This should allow for the app to be run on the port number in the console when the run icon is clicked.
