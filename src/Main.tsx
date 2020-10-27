import React, { Fragment, useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

let allWordsStr = `possibility,continent,beetle,grasp,africa,jewelry,february,comic,killed,avenue,entrance,quiet,melody,climbed,valley,feast,bottom,wrote,freight,sheepish,register,youth,discard,betray,sleeve,continued,president,defendant,infant,launch,aware,immigrant,eagle,debate,trouble,irritant,layer,plains,situation,assistant,desirable,adaptable,station,brilliant,excitable,allowable,description,compliant,breakable,comfortable,prescription,extravagant,notable,distinguishable,subscription,ignorant,tolerable,preferable,condition,artifact,religion,membrane,introduction,migration,tradition,transportation,technique,nomad,ceremony,active,divisible,adapt,customary,passive,array,agriculture,folklore,inverse,composite,rounding,organ,regroup,factorization,wobble,surprise,january,april,ashamed,french,england,coward,consonant,hesitate,route,symbols,someone,sway,design,loyal,shovel,exactly,bruise,application,wheelbarrow,remain,awkward,beckon,hedges,beige,billion,saucer,wonder,breathe,triple,admission,smiled,succeed,bicycle,politician,angle,horrible,octave,drawing,absent,tangible,pentameter,recession,decadent,gullible,quadruple,concession,excellent,possible,unique,deception,frequent,permissible,quadriceps,production,impatient,comprehensible,uniform,reduction,cell,invisible,interact,chlorophyll,cytoplasm,tissue,specialize,chloroplast,organelle,function,surplus,activate,diffusion,specific,barter,photosynthesis,osmosis,mitochondria,economy,stomata,respiration,glucose,cultural,vascular,june,suppose,direct,supply,choose,august,october,december,single,coast,squirm,mentor,novel,menu,scissors,insects,information,period,desert,internal,express,autumn,increase,external,crimson,journey,convict,index,ancestor,flavor,finance,indices,further,substantial,wound,doctor,elasticity,spatial,business,provide,authenticity,essential,separate,fungus,criticize,inferential,approximate,fungi,electricity,influential,estimate,hippopotamus,publicity,palatial,associate,hippopotami,partial,residential,certificate,octopus,transpiration,artery,navigation,octopi,xylem,vein,convert,tributary,phloem,circulatory,emperor,mission,pigment,capillary,circumnavigation,slavery,absorb,chamber,cartographer,trading,evaporate,ventricle,colony,charter`;

var voices = {
    'Google US English': 1,
    'Google UK English Female': 2,
    'Google UK English Male': 3,
    'Microsoft Zira Desktop - English (United States)': 4,
};

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

let allWordsArray = allWordsStr.split(",");

shuffle(allWordsArray);

const Main = () => {
    const numOfTotalWords = allWordsArray.length;
    let msg = useRef(new SpeechSynthesisUtterance());
    let [currentVoice, setCurrentVoice] = useState(4);
    let defaultVoiceOnce = useRef(0);
    let [userInput, setUserInput] = useState('');
    let [numOfCorrect, setNumOfCorrect] = useState(0);
    let [numOfMistakes, setNumOfMistakes] = useState(0);
    let [unhiddenCurrentWordStr, setUnhiddenCurrentWordStr] = useState('');
    let [currentWordIndex, setCurrentWordIndex] = useState(0);
    let [currentWord, setCurrentWord] = useState(allWordsArray[currentWordIndex]);
    let [numOfDoneWords, setNumOfDoneWords] = useState(0);
    let [currentStreak, setCurrentStreak] = useState(0);
    let [started, setStarted] = useState(false);
    let [hideAll, setHideAll] = useState(false);
    let [colorOfInput, setColorOfInput] = useState('primary');
    let [isError, setIsError] = useState(false);
    let [openedHintBefore, setOpenedHintBefore] = useState(false);
    let [prestarted, setPrestarted] = useState(false);
    const [open, setOpen] = React.useState(false);

    function cancelSpeaking() {
        window.speechSynthesis.cancel();
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const useStyles = makeStyles((theme) => ({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }));

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function talk(text) {
        msg.current.volume = 1; // From 0 to 1
        msg.current.rate = 1; // From 0.1 to 10
        msg.current.pitch = 1; // From 0 to 2
        msg.current.text = text;
        if (window.speechSynthesis.getVoices() && defaultVoiceOnce.current === 0) {
            msg.current.voice = window.speechSynthesis.getVoices()[4];
            defaultVoiceOnce.current = 1;
        }
        window.speechSynthesis.speak(msg.current);
    }

    function changeVoice() {
        if (currentVoice < 5) {
            setCurrentVoice(currentVoice + 1);
        } else {
            setCurrentVoice(1);
        }
        if (currentVoice === 1) { // skiping dutch
            setCurrentVoice(currentVoice + 2);
        }
    }

    function prestart() {
        window.speechSynthesis.cancel();
        talk('Welcome to the Spelling Bee Practice App Saeed!');
        setPrestarted(true);
    }

    function start() {
        window.speechSynthesis.cancel();
        talk(`The word is: ${currentWord}`);
        setStarted(true);
    }

    useEffect(() => {
        cancelSpeaking();
        return () => {
            setNumOfCorrect(0);
            setCurrentStreak(0);
            setNumOfMistakes(0);
            setNumOfDoneWords(0);
            setUserInput('');
            setIsError(false);
            setCurrentWordIndex(0);
            setStarted(false);
            setPrestarted(false);
            setUnhiddenCurrentWordStr('');
            setCurrentWordIndex(0);
            cancelSpeaking();
        };
    }, []); // don't auto refresh 

    useEffect(() => {
        if (started && numOfDoneWords !== 0 && currentStreak !== 0) {
            cancelSpeaking();
            talk(`Correct! ${currentWord}`);
        } else if (started && numOfDoneWords !== 0) {
            talk(`Skipped. the word is ${currentWord}`);
        }
    }, [started, currentWord]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        cancelSpeaking();
        msg.current.voice = window.speechSynthesis.getVoices()[currentVoice];
    }, [currentVoice]);

    function skip() {
        setOpen(true);
        console.log(`${currentWord}`);
        setCurrentStreak(0);
        setNumOfDoneWords(numOfDoneWords + 1);
        setNumOfMistakes(numOfMistakes + 2);
        selectNewWord();
        setUserInput('');
        setColorOfInput('primary');
        hideWordSpelling();
        setIsError(true);

    }

    function checkSpelling() {
        let inputtedSpellingIsCorrect = typeof userInput === 'string' && userInput.toLowerCase().trim() === currentWord.toLowerCase().trim();

        if (inputtedSpellingIsCorrect) {
            setNumOfCorrect(numOfCorrect + 1);
            setCurrentStreak(currentStreak + 1);
            setNumOfDoneWords(numOfDoneWords + 1);
            selectNewWord();
            setUserInput('');
            setColorOfInput('secondary');
            setTimeout(() => {
                setColorOfInput('primary');
            }, 625);
            hideWordSpelling();
            setIsError(false);
        } else {
            if (userInput.trim() !== "") {
                cancelSpeaking();
                setCurrentStreak(0);
                talk('Wrong, try again');
                setColorOfInput('primary');
                setIsError(true);
                setNumOfMistakes(numOfMistakes + 1);
            }
        }
    }

    function selectNewWord() {
        if (currentWordIndex < allWordsArray.length - 1) {
            setCurrentWord(allWordsArray[currentWordIndex + 1]);
            setCurrentWordIndex(currentWordIndex + 1);
        } else {
            setHideAll(true);
            if (numOfCorrect + 1 === numOfTotalWords && openedHintBefore === false && numOfMistakes <= 15) {
                alert(`WOWWW! YOU GOT ALL OF THE WORDS RIGHT WITH BARELY ANY MISTAKES!!!!\nYOU ARE SO AWESOME!\nTake a screenshot of your achievement and sent it to me :D\nThere's a big prize for you :D!\n`);
            } else {
                alert(`You finished all of the words! Your final score was:\n\n${numOfTotalWords} words done\n${numOfMistakes} mistakes\n\nClick OK to try again.`);
            }
            window.location.reload(true);
        }
    }

    let inputStyle: any = {
        width: "250px",
        marginBottom: "20px",
        marginTop: "20px",
        textAlign: "center",
    };

    let buttonStyle1 = {
        width: "250px",
    };

    let buttonStyle2 = {
        width: "250px",
        marginBottom: "10px",
    };

    function showWordSpelling() {
        setUnhiddenCurrentWordStr(currentWord);
        setOpenedHintBefore(true);
    }

    function hideWordSpelling() {
        setUnhiddenCurrentWordStr('');
    }

    return (
        <>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
                <Alert onClose={handleClose} severity="info">
                    You skipped a word: {allWordsArray[currentWordIndex - 1]}
                </Alert>
            </Snackbar>
            {!hideAll && <>
                {!prestarted && !started && <Button style={buttonStyle1} size="large" variant="contained" onClick={() => prestart()}>Begin</Button>}
                {prestarted && !started &&
                    <>
                        <p>You can press enter to submit</p>
                        <p>You can press enter when the input field is empty to hear the word again</p>
                        <p>You can change the voice by clicking on the Change Voice button - useful for some words</p>
                        <p>Skipping counts as 2 mistakes, but you'll get to see the correct spelling</p>
                        <p>If you finish all of the words while having 15 or less mistakes<br />and without using any hints then there's a prize for you :D</p>
                        <Button style={buttonStyle1} size="large" variant="contained" onClick={() => start()}>Got it</Button>
                    </>}
                {started &&
                    <>
                        <table id="mainTable">
                            <tbody>
                                <tr>
                                    <td>Remaining</td><td>{numOfTotalWords - numOfDoneWords}</td>
                                </tr>
                                <tr>
                                    <td>Completed</td><td>{numOfCorrect}</td>
                                </tr>
                                <tr>
                                    <td>Streak</td><td>{currentStreak}</td>
                                </tr>
                                <tr>
                                    <td>Mistakes</td><td>{numOfMistakes}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div>
                            <form spellCheck="false" onSubmit={e => e.preventDefault()}>
                                <TextField style={inputStyle} inputProps={{ min: 0, style: { textAlign: 'center' } }} error={isError} color={colorOfInput as any} id="outlined-basic" label="Spelling" variant="outlined" value={userInput} onChange={e => setUserInput(e.target.value)} onKeyDown={e => {
                                    if (e.key === 'Enter') {
                                        if (userInput === "") {
                                            talk(currentWord);
                                            setUserInput('');
                                            return;
                                        }
                                        checkSpelling();
                                    }
                                }} />
                            </form>
                            <br />
                            <Button variant="contained" style={buttonStyle2} color="primary" onClick={() => checkSpelling()}>Check</Button><br />
                            <Button variant="contained" style={buttonStyle2} onClick={() => skip()}> Skip Word</Button><br />
                            <Button variant="contained" style={buttonStyle2} onClick={() => window.open(`https://www.google.com/search?q=Dictionary&stick=H4sIAAAAAAAAAONQesSoyi3w8sc9YSmZSWtOXmMU4-LzL0jNc8lMLsnMz0ssqrRiUWJKzeNZxMqFEAMA7_QXqzcAAAA&zx=1603756488141#dobs=${currentWord}`, "_blank")}>Definition</Button><br />

                            <Button variant="contained" style={buttonStyle2} onClick={() => unhiddenCurrentWordStr ? hideWordSpelling() : showWordSpelling()}> {unhiddenCurrentWordStr ? "Hide Spelling" : "Show Spelling"}</Button><br />
                            <h2>{unhiddenCurrentWordStr}</h2>
                            <br />


                            <Button variant="contained" style={buttonStyle2}
                                onClick={() => {
                                    cancelSpeaking();
                                    talk(currentWord);
                                }}>Listen Again</Button><br />
                            <Button variant="contained" style={buttonStyle2}
                                onClick={() => {
                                    cancelSpeaking();
                                    changeVoice();
                                }}>Change Voice</Button><br />
                            {voices[window?.speechSynthesis?.getVoices()[currentVoice]?.name]}- {window?.speechSynthesis?.getVoices()[currentVoice]?.name}
                        </div>
                    </>
                }
            </>}
        </>
    );
};

export default Main;

/*{loading && <h6 style={{ paddingLeft: 30 }}>Loading...</h6>}
{filesArr.map((item, key) => {
  return <div className="row" key={key} />;
})}*/
