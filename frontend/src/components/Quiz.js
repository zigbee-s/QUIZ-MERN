import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { Questionaire } from './Questionaire';
import quesData from "../data/questions";


const Quiz = () => {
    //store all user data
    const [user, setUser] = useState({});

    //Store questions 
    const [questions, setQuestions] = useState(quesData);
    
    //Store index of the current question
    const [currentIndex, setCurrentIndex] = useState(0);

    //Store the current score
    const [score, setScore] = useState(0);

    //Store the state of the quiz
    const [quizEnded, setQuizEnded] = useState(false);

    const history = useHistory();

    const callQuizPage = async () => {
        try {
            const response = await fetch('/user', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await response.json();

            if (!response.status === 200) {
                const error = new Error(response.error);
                throw error;
            }

            setUser(data);
            setScore(data.score);
            setCurrentIndex(data.answers.length);
            setQuizEnded(data.quizEnded);

        } catch (error) {
            history.push('/signin');
            console.log(error);
        }
    }

    const PostAnswer = async (e) => {
        e.preventDefault();

        let answer = e.target.value;

        const { email } = user;

        let newScore = score;

        if (answer === questions[currentIndex].answer) {
            newScore = score + 1;
        }

        //Getting data from a get request
        try {
            const response = await fetch('/user', {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                },
                credentials: "include"
            });

            const data = await response.json();

            if (!response.status === 200) {
                const error = new Error(response.error);
                throw error;
            }


            if (currentIndex <= data.answers.length - 1) {
                setCurrentIndex(data.answers.length);
                setScore(data.score);
                setQuizEnded(data.quizEnded);
            } else {
                //Post Answer
                const res = await fetch("/answer", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email, answer, newScore, quizEnded
                    })
                })

                const data = await res.json();

                if (data.message = "Answer added") {
                    setCurrentIndex(data.currentIndex + 1);
                    setScore(data.score);
                }
            }

        } catch (error) {
            history.push('/signin');
            console.log(error);
        }
    }

    useEffect(() => {
        setQuestions(quesData);
        callQuizPage();

    }, []);


    return quizEnded ? (
        <h1>Your score was {score} </h1>
    ) : questions.length > currentIndex ? (
        <>
            {<Questionaire user data={questions[currentIndex]} PostAnswer={PostAnswer}></Questionaire>}
        </>
    ) : (
        <h1>2 Your score was {score} </h1>
    );
}

export default Quiz;