[![Stories in Ready](https://badge.waffle.io/desertsharks/tokki.png?label=ready&title=Ready)](https://waffle.io/desertsharks/tokki)
# Tokki

 An interactive platform that allows the audience to cast votes live and answer on-demand quizzes

__[http://tokki.herokuapp.com/](http://tokki.herokuapp.com/)__

## Summary

Tokki is originally developed by team desertsharks. It is an application that allows audience to cast live vote to the presenter so the presenter can know the real time feedback. Team spacemanatee
takes this app to the next level by allowing presenter to generate questions, cast queizzes on live, and receive real time status on audience's understanding. It can be readily used as a classroom quiz application where professor can test the students' understanding and adjust the lecture pace on the fly. 

## Features

- Socket.io session to cast live votes or live quizzes
- analyze the class performance on demand
- Allows professor/presenter to generate questions
- Added animation to allow better user experience

## Tech Stack

Angular, Node/Express, Socket.io, Backbone, Firebase

## Developer Environment

1. Register for Facebook Application and obtain key:
   Create a new file server/auth/config.js, reference server/auth/config.example.js,
   Fill in your key as below:
   
   ```sh
   facebookAuth : {
    prod: {
      clientID : 'your-secret-clientID-here', // Your App ID
      clientSecret : 'your-client-secret-here', // Your App Secret
      callbackURL : 'http://localhost:3000/host/auth/facebook/callback'
    },
    dev: {
      clientID : 'your-secret-clientID-here', // Your App ID
      clientSecret : 'your-client-secret-here', // Your App Secret
      callbackURL : 'http://localhost:3000/host/auth/facebook/callback'
    }
  }
   ```

1. Run the following in the project directory:

    ```sh
    # install the grunt-cli
    npm install -g grunt-cli

    # install dependencies
    npm install
    bower install

    # start server
    node server.js
    ```

1. Open http://localhost:3000 in your browser.

1. If you are on the live site, and want to try to log in as admin, please
contact us.

## Screenshots

Login Page:
![Image of Login]
()


Presenter/Teacher Page:
![Image of Presenter/Teacher Page]
()


Audience/Student Page:
![Image of Audience/Student Page]
()



## Team

- Travis Neufeld - [github.com/TravisJN](https://github.com/TravisJN)
- David Tan - [github.com/davidtansf](https://github.com/davidtansf)
- Paul Brady - [github.com/pablobrady](https://github.com/pablobrady)
- Seven Li - [github.com/7seven7lst](https://github.com/7seven7lst)




