<template>
        <div>
            <!-- ============================== -->
                    <!-- Quiz Card -->
            <!-- ============================== -->
            <div class="main_container card" style="height: 100%">
                <div v-if="!finished">
                    <div class="inner"><p class="question-item noselect">{{ currentIndex + 1 }}. {{ practice_test.practice_test.quiz.question_set[questions[currentIndex]].label }}</p>
                        <div class="items">
                            <div class="pick" v-for="answerData in practice_test.practice_test.quiz.question_set[questions[currentIndex]].answer_set" :key="answerData.id">
                                <input type="radio" :value="answerData.id" :id="answerData.id" class="answer" name="choice" :checked="answerDetail[currentIndex] ==  answerData.id"><span class="checkmark noselect">{{ answerData.label }}</span>     
                                <!-- <p>{{ $route.params.slug }}</p>                -->
                            </div>
                        </div>
                    </div>
                    <div class="btn-container">
                        <button class="btn-nxt" @click="handler">Next</button>
                        <button class="bck" @click="moveBack" v-if="currentIndex >= 1">Back</button>
                    </div>
                </div>
                <div v-else>
                    <div class="inner"><p class="question-item noselect">You've successfully completed {{ practice_test.practice_test.quiz.name }}</p>
                        <div class="items">
                            <p>40 set questions</p>
                            <p><b>{{ (results.quiztaker_set.score / 40) * 100 }}</b>% answered correctly</p>
                            <p>Your result: {{ results.quiztaker_set.score }} of 40</p>
                            <div v-if="(results.quiztaker_set.score / 40) * 100 >= 65">
                                <p>You reached the pass mark</p>
                            </div>
                            <div v-if="(results.quiztaker_set.score / 40) * 100 <= 65">
                                <p>You failed the test please retry</p>
                            </div>
                            <p>Not happy with your score? <a :href="$router.resolve({ name:'Question', params: {slug: $route.params.slug} }).href">Retake</a></p>
                        </div>
                    </div>
                    <!-- <a class="btn" >Quizzes</a> -->
                    <div class="btn-container">
                        <router-link class="btn-nxt" :to="{ name:'Skill'}" tag="button">Quiz</router-link>
                    </div>
                    <!-- this.$route.params.slug -->
                </div>
                <!-- ======================= -->
                    <!-- PROGRESS BAR -->
                <!-- ======================= -->
                <div class="bar-limit"></div>
                <div class="progress-bar"  v-bind:style="{ width: cur_progress + '%' }"></div>
            </div>
                    <!-- ===================================== -->
                        <!-- the quiz timer -->
            <!-- ===================================== -->
            <div class="base-timer" v-if="!finished">
                <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <g class="base-timer__circle">
                    <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
                    <path
                    :stroke-dasharray="circleDasharray"
                    class="base-timer__path-remaining"
                    :class="remainingPathColor"
                    d="
                        M 50, 50
                        m -45, 0
                        a 45,45 0 1,0 90,0
                        a 45,45 0 1,0 -90,0
                    "
                    ></path>
                </g>
                </svg>
                <span class="base-timer__label">{{ formattedTimeLeft }}</span>
            </div>
        </div>
</template>


<script>
    import { mapState } from 'vuex'
    import { mapActions } from 'vuex'
    import { getAPI } from "../../utils/axios-api";

    const token = localStorage.getItem("access_token");
    const FULL_DASH_ARRAY = 283;
    const WARNING_THRESHOLD = 10;
    const ALERT_THRESHOLD = 5;

    const COLOR_CODES ={
        info:{
            color: "green"
        },
        warning:{
            color: "orange",
            threshold: WARNING_THRESHOLD
        },
        alert:{
            color: "red",
            threshold: ALERT_THRESHOLD
        }
    };

    const TIME_LIMIT = 60;


    export default {
        name: "questionCard",
        data () {
            return{
                finished: false,
                timePassed: 0,
                timerInterval: null,
                currentIndex: 0,
                quizTaker: '',
                question: '',
                answer: '',
                cur_progress: 0,
                results: 0,
                selectedAnswer: false,
                answerDetail: {},
                score: 0,
                questions: [],
                questionPointer: 0,
                quizStarted: false,
                quizCancelled: false,
            }
        },

        computed: {
            ...mapState(["practice_test"]),

            circleDasharray() {
                return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;              
            },

            formattedTimeLeft() {
                const timeLeft = this.timeLeft;
                const minutes = Math.floor(timeLeft / 60);
                let seconds = timeLeft % 60;

                if (seconds < 10) {
                seconds = `0${seconds}`;
                }

                return `${minutes}:${seconds}`;
            },

            timeLeft() {
                return TIME_LIMIT - this.timePassed;
            },

            timeFraction() {
                const rawTimeFraction = this.timeLeft / TIME_LIMIT;
                return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
            },

            remainingPathColor() {
                const { alert, warning, info } = COLOR_CODES;

                if (this.timeLeft <= alert.threshold) {
                    return alert.color;
                }else if (this.timeLeft <= warning.threshold) {
                    return warning.color;
                } else {
                    return info.color;
                }
            },

        },

        created(){
            this.questions = Array.from(Array(40).keys());
            // console.log(this.questions)
            this.randomize()
            // console.log(this.questions)
        },
        
        methods: {
            shuffleQuestions(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    const temp = array[i];
                    this.$set(array, i, array[j]);
                    this.$set(array, j, temp);
                }
            },

            ...mapActions("practice_test", ["getPracticeTest"], "saveAnswer", "submitAnswer"),

            randomize() {
                this.shuffleQuestions(this.questions);
                console.log(this.questions)
            },

            sendResponse(){
                this.$store.dispatch('saveAnswer', {
                    quizTaker: this.quizTaker,
                    question: this.question,
                    answer: this.answer,
                }).then(({ status }) => {
                    console.log('answer sent')
                    console.log(status)
                }).catch(err=>{
                    console.log(err)
                    this.$notification.error("You have an unstable internet connection, Please retry the quiz \n Your previous answers won't be saved", { infiniteTimer: false, position: 'bottomRight', showCloseIcn: true});                
                    // this.showWarnMsg()
                    clearInterval(this.timerInterval);
                    setTimeout(this.getResults, 3000);
                    this.finished = true
            
                })
            },

            submitAnswer(){
                const slug = this.$route.params.slug
                // this.answer = parseInt(document.querySelector('input[name="choice"]:checked').value, 10)
                getAPI
                    .post(`/quizzes/${slug}/submit/`, {
                        headers: { Authorization: `Bearer ${token}` },
                        quiztaker: this.quizTaker,
                        question: this.question,
                        answer: this.answer
                    })
                    .then(res => {
                        clearInterval(this.timerInterval);
                        console.log('testing from line:87')
                        if (res.status == 200) {
                            console.log(status);
                            this.finished = true
                            this.results = res.data
                        }
                        console.log('======================//Debug//===============')
                        console.log(res.data)
                        console.log('======================//Debug//===============')
                    })
                    .catch((err) => {
                        this.finished = true
                        console.log(err);
                        console.log("Check data not reading ref: actions.js >> course");
                });
            },

            getResults(){
                const slug = this.$route.params.slug
                console.log('get all results this is slug:' + slug)
                getAPI
                    .get(`/quizzes/${slug}/`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    .then((res) => {
                        this.results = res.data
                        this.score = this.results.quiztakers_set.score
                        console.log(this.results)
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            moveNext: function nextQuestion(){
                if (this.currentIndex == 39) {
                    this.cur_progress = (this.currentIndex/39)*100
                    console.log(this.questions)
                    this.quizTaker = this.practice_test.practice_test.quiz.quiztakers_set.id
                    this.answer = parseInt(document.querySelector('input[name="choice"]:checked').value, 10)
                    this.question = this.practice_test.practice_test.quiz.question_set[this.questions[this.currentIndex]].id
                    this.submitAnswer()
                    this.finished = true
                    this.getResults()
                } else {
                    this.cur_progress = (this.currentIndex/39)*100
                    this.quizTaker = this.practice_test.practice_test.quiz.quiztakers_set.id
                    this.answer = parseInt(document.querySelector('input[name="choice"]:checked').value, 10)
                    this.question = this.practice_test.practice_test.quiz.question_set[this.questions[this.currentIndex]].id
                    this.answerDetail[this.currentIndex] = this.answer;
                    this.currentIndex += 1;
                }
            },

            
            moveBack: function prevQuestion(){
                if (this.currentIndex == 39) {
                    this.cur_progress = (this.currentIndex/39)*100
                    this.quizTaker = this.practice_test.practice_test.quiz.quiztakers_set.id
                    this.answer = parseInt(document.querySelector('input[name="choice"]:checked').value, 10)
                    this.question = this.practice_test.practice_test.quiz.question_set[this.questions[this.currentIndex]].id
                    this.submitAnswer()
                    this.finished = true
                    this.getResults()
                } else {
                    this.currentIndex -= 1;
                    this.cur_progress = (this.currentIndex/39)*100
                    this.quizTaker = this.practice_test.practice_test.quiz.quiztakers_set.id
                    this.answer = parseInt(document.querySelector('input[name="choice"]:checked').value, 10)
                    this.question = this.practice_test.practice_test.quiz.question_set[this.questions[this.currentIndex]].id
                }
            },

            handler: function(){
                this.moveNext();
                this.sendResponse();
            },

            onTimesUp() {
                clearInterval(this.timerInterval);
                this.submitAnswer()
            },

            startTimer() {
                this.timerInterval = setInterval(() => (this.timePassed += 1), 1000);
            },

        },

            // get data from store **pass the action name**
        mounted(){
            const slug = this.$route.params.slug;
            this.getPracticeTest(slug);
            this.startTimer();
        },


        watch: {
            timeLeft(newValue) {
                if (newValue === 0) {
                    this.onTimesUp();
                }
            }
        },
        // get data from store **pass the action name**
    }
</script>

<style scoped lang="scss">
    .main_container{
        margin: 10rem 20em 0 20em;
        margin: auto;
    }

    .card{
        /*border:groove;*/
        width:70%;
        height: 60%;
        border-radius: 0px;
        border-color: none;
    }

    .progress-bar{
        width: 0%;
        height: 6px;
        background-color: rgba(195,0,12,1);
        position: absolute;
        bottom: 0;
    }

    .bar-limit{
        width: 100%;
        height: 6px;
        background-color: rgba(255, 0, 0, 0.267);
        position: absolute;
        bottom: 0;
    }

    .inner{
        margin: 3rem;
        font-size: 15px;
        overflow-x: hidden;
        height: 100%;
    }

    .btn-nxt{
        border: none;
        background-color: #007cc3;
        text-decoration: none;
        width: 20%;
        color: #fff;
        height: 2rem;
        outline: none;
        border-radius: 0px;
        position: absolute;
        margin: auto;
        right: 0;
    }

    .bck{
        border: none;
        background-color: #007cc3;
        text-decoration: none;
        width: 20%;
        color: #fff;
        height: 2rem;
        outline: none;
        border-radius: 0px;
        position: absolute;
        margin: auto;
        left: 0;
    }

    .btn-container{
        margin: 0 3rem;
        position: relative;
        height: 70px;
    }

    .answer{
        margin-right: 1rem;    
    }

    .pick>li{
        list-style: none;
    }

    .main_container {
        box-sizing: border-box;
    }

    .noselect { 
    -webkit-touch-callout: none; /* iOS Safari */ 
        -webkit-user-select: none; /* Safari */ 
        -khtml-user-select: none; /* Konqueror HTML */ 
        -moz-user-select: none; /* Firefox */ 
            -ms-user-select: none; /* Internet Explorer/Edge */ 
                user-select: none; /* Non-prefixed version, currently 
                                    supported by Chrome and Opera */ 
    } 

    .question-item{
        font-size: 18px;
        /* font-weight: ; */
    }


    .base-timer {
    position: absolute;
    right: 4rem;
    width: 100px;
    height: 100px;
    top: 4rem;

    &__svg {
        transform: scaleX(-1);
    }

    &__circle {
        fill: none;
        stroke: none;
    }

    &__path-elapsed {
        stroke-width: 7px;
        stroke: grey;
    }

    &__path-remaining {
        stroke-width: 7px;
        stroke-linecap: round;
        transform: rotate(90deg);
        transform-origin: center;
        transition: 1s linear all;
        fill-rule: nonzero;
        stroke: currentColor;

        &.green {
        color: rgb(65, 184, 131);
        }

        &.orange {
        color: orange;
        }

        &.red {
        color: red;
        }
    }

    &__label {
        position: absolute;
        width: 100%;
        // height: 300px;
        top: 25%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 30px;
        // left: 15%;
    }
    }
</style>