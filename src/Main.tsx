import React, { Fragment, useEffect, useRef, useState } from "react";
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import { ToggleButton } from "@material-ui/lab";
import CheckIcon from "@material-ui/icons/Check";
import wordDefinition from "word-definition";


let allHardWordsStr = `possibility,jewelry,avenue,february,distinguishable,situation,irritant,excitable,freight,comprehensible,compliant,extravagant,subscription,preferable,superintendent,january,factorization,chlorophyll,hippopotamus,surprise,consonant,politician,saucer,wheelbarrow,beige,awkward,bruise,application,mitochondria,wealthy,grasp,quiet,unfortunately,migration,ignorant,brilliant,assistant,hippopotami,artifact,immigrant,defendant,transpiration,wobble,agriculture,approximate,rounding,tangible,recession,cartographer,decadent,gullible,unique,chloroplast,shovel,betray,excellent,sheepish,pentameter,hedges,respiration,squirm,ashamed,authenticity,cytoplasm,substantial,stomata,subscription,function,organelle,specialize,scenery,recommend,specific,diffusion,surplus,slumber,quadriceps,specific,osmosis,august,mentor,solemn,criticize,inferential,sincerity,certificate,electricity,influential,estimate,scarcity,transferring,publicity,palatial,associate,vehicle,transferred,circulatory,phloem,tributary,xylem,threatening,restaurant,capillary,significance,receipt,transmitted,ventricle,reasonable,receiving,recruit,supposedly,reprimand,recipe,recognition,traveled,unnecessary,elasticity,vigorously,separate,university,traveling,spatial,ancestor,indices,business,secretary,spacious,souvenir,stationary,stationery,securing,statistics,supervisor,substitute,sincerely,visualize,circumnavigation,prescription,photosynthesis,tissue`;
let allWordsStr = `possibility,continent,beetle,grasp,africa,jewelry,february,comic,killed,avenue,entrance,quiet,melody,climbed,valley,feast,bottom,wrote,freight,sheepish,register,youth,discard,betray,sleeve,continued,president,defendant,infant,launch,aware,immigrant,eagle,debate,trouble,irritant,layer,plains,situation,assistant,desirable,adaptable,station,brilliant,excitable,allowable,description,compliant,breakable,comfortable,prescription,extravagant,notable,distinguishable,subscription,ignorant,tolerable,preferable,condition,artifact,religion,membrane,introduction,migration,tradition,transportation,technique,nomad,ceremony,active,divisible,adapt,customary,passive,array,agriculture,folklore,inverse,composite,rounding,organ,regroup,factorization,wobble,surprise,january,april,ashamed,french,england,coward,consonant,hesitate,route,symbols,someone,sway,design,loyal,shovel,exactly,bruise,application,wheelbarrow,remain,awkward,beckon,hedges,beige,billion,saucer,wonder,breathe,triple,admission,smiled,succeed,bicycle,politician,angle,horrible,octave,drawing,absent,tangible,pentameter,recession,decadent,gullible,quadruple,concession,excellent,possible,unique,deception,frequent,permissible,quadriceps,production,impatient,comprehensible,uniform,reduction,cell,invisible,interact,chlorophyll,cytoplasm,tissue,specialize,chloroplast,organelle,function,surplus,activate,diffusion,specific,barter,photosynthesis,osmosis,mitochondria,economy,stomata,respiration,glucose,cultural,vascular,june,suppose,direct,supply,choose,august,october,december,single,coast,squirm,mentor,novel,menu,scissors,insects,information,period,desert,internal,express,autumn,increase,external,crimson,journey,convict,index,ancestor,flavor,finance,indices,further,substantial,wound,doctor,elasticity,spatial,business,provide,authenticity,essential,separate,fungus,criticize,inferential,approximate,fungi,electricity,influential,estimate,hippopotamus,publicity,palatial,associate,hippopotami,partial,residential,certificate,octopus,transpiration,artery,navigation,octopi,xylem,vein,convert,tributary,phloem,circulatory,emperor,mission,pigment,capillary,circumnavigation,slavery,absorb,chamber,cartographer,trading,evaporate,ventricle,colony,charter,raspberry,reasonable,receipt,Receiving,recipe,recognition,recommend,recruit,reddest,reprimand,resigned,restaurant,rotten,sandwich,scarcity,scenery,secretary,securing,significance,simile,sincerely,sincerity,situation,skeptical,slumber,smudge,solemn,souvenir,spacious,specific,stationary,stationery,statistics,subscription,substitute,superintendent,supervisor,supposedly,threatening,tolerate,tongue,tournament,tragedy,traitor,transferred,transferring,transmitted,traveled,traveling,unfortunately,uniform,university,unnecessary,valuable,various,vehicle,version,vertical,victim,vigorously,violation,visualize,volcano,voyage,wealthy,weapon,wheeze,wilderness`;

function shuffle(array: string[]) {
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

let allHardWordsArray = allHardWordsStr.split(",");
let allWordsArray = allWordsStr.split(",");
let numOfTotalWords = allWordsArray.length;

shuffle(allWordsArray);
shuffle(allHardWordsArray);

const Main = () => {
    let msg = useRef(new SpeechSynthesisUtterance());
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
    let [hardMode, setHardMode] = useState(false);
    let [voices, setVoices] = useState([]);
    let [currentVoiceIndex, setCurrentVoiceIndex] = useState(0);
    let [useEnglishVoicesOnly, setUseEnglishVoicesOnly] = useState(true);
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

    function Alert(props) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    function talk(text) {
        msg.current.volume = 1; // From 0 to 1
        msg.current.rate = 1; // From 0.1 to 10
        msg.current.pitch = 1; // From 0 to 2
        msg.current.text = text;
        window.speechSynthesis.speak(msg.current);
    }

    function nextVoice() {
        if (currentVoiceIndex + 1 >= voices.length) {
            setCurrentVoiceIndex(0);
        } else {
            setCurrentVoiceIndex(currentVoiceIndex + 1);
        }
        cancelSpeaking();
        setTimeout(() => {
            talk(currentWord);
        }, 100);
    }

    function prevVoice() {
        if (currentVoiceIndex - 1 < 0) {
            setCurrentVoiceIndex(voices.length - 1);
        } else {
            setCurrentVoiceIndex(currentVoiceIndex - 1);
        }
        cancelSpeaking();
        setTimeout(() => {
            talk(currentWord);
        }, 200);
    }

    function toggleUsingEnglishVoicesOnly() {
        if (useEnglishVoicesOnly) {
            setUseEnglishVoicesOnly(false);
        } else {
            setUseEnglishVoicesOnly(true);
        }

        setTimeout(() => {
            talk(currentWord);
        }, 150);
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
        if (hardMode) {
            allWordsArray = shuffle(allHardWordsStr.split(","));
            numOfTotalWords = allWordsArray.length;
            setCurrentWord(allWordsArray[0]);
        } else {
            allWordsArray = shuffle(allWordsStr.split(","));
            numOfTotalWords = allWordsArray.length;
            setCurrentWord(allWordsArray[0]);
        }
    }, [hardMode]); // eslint-disable-line react-hooks/exhaustive-deps

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
            setCurrentVoiceIndex(0);
            cancelSpeaking();
            setUseEnglishVoicesOnly(true);
        };
    }, []); // don't auto refresh

    useEffect(() => {
        // set only english voices array
        let allVoices = window?.speechSynthesis?.getVoices();
        allVoices = allVoices.sort((a, b) => {
            if (a.lang === 'en-US') {
                return 1;
            }
            if (a.lang < b.lang) {
                return -1;
            } else if (a.lang > b.lang) {
                return 1;
            } else {
                return 0;
            }
        });

        if (useEnglishVoicesOnly) {
            let allOtherVoices = allVoices?.filter((voice) => {
                return voice.lang.startsWith('en')
                    && !voice.lang.startsWith('en-US')
                    && !voice.lang.startsWith('en-GB')
                    && !voice.lang.startsWith('en-AU')
                    && !voice.lang.startsWith('en-NZ')
                    && !voice.lang.startsWith('en-CA');
            });
            let enGbOnlyTemp = allVoices?.filter((voice) => {
                return voice.lang.startsWith('en-GB');
            });
            let enAuOnlyTemp = allVoices?.filter((voice) => {
                return voice.lang.startsWith('en-AU');
            });
            let enNzOnlyTemp = allVoices?.filter((voice) => {
                return voice.lang.startsWith('en-NZ');
            });
            let enCaOnlyTemp = allVoices?.filter((voice) => {
                return voice.lang.startsWith('en-CA');
            });
            let enUsOnlyTemp = allVoices?.filter((voice) => {
                return voice.lang.startsWith('en-US');
            });
            let voicesTemp = [...enUsOnlyTemp, ...enGbOnlyTemp, ...enCaOnlyTemp, ...enAuOnlyTemp, ...enNzOnlyTemp, ...allOtherVoices];

            setVoices(voicesTemp);
            console.log(voicesTemp);
        } else {
            setVoices(allVoices);
        }

        setCurrentVoiceIndex(0);

    }, [started, useEnglishVoicesOnly]);

    useEffect(() => {
        if (started && numOfDoneWords !== 0 && currentStreak !== 0) {
            cancelSpeaking();
            talk(`Correct! ${currentWord}`);
        } else if (started && numOfDoneWords !== 0) {
            talk(`Skipped. the word is ${currentWord}`);
        }
    }, [started, currentWord]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        msg.current.voice = voices[currentVoiceIndex];
    }, [voices, currentVoiceIndex]);

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
        let inputtedSpellingIsCorrect = typeof userInput === 'string' && userInput.toLowerCase().trim().replaceAll(/[^A-Za-z]+/g, "") === currentWord.toLowerCase().trim();

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
                        <br />
                        <table>
                            <tbody>
                                <tr>
                                    <td style={{ color: hardMode ? 'red' : '' }}>Hard Words Only&nbsp;&nbsp;</td>
                                    <td><ToggleButton
                                        value="check"
                                        size="small"
                                        selected={hardMode}
                                        onChange={() => {
                                            setHardMode(!hardMode);
                                        }}>
                                        <CheckIcon />
                                    </ToggleButton>
                                    </td>

                                </tr>
                            </tbody>
                        </table>

                        <br />
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
                            <Button variant="contained" style={buttonStyle2} onClick={() => {
                                //window.open(`https://www.google.com/search?q=define+${currentWord}`, "_blank");
                                wordDefinition.getDef(currentWord, 'en', null,
                                    (res) => {
                                        console.log(res)
                                        talk(`category: ${res.category}  definition: ${res.definition}`);
                                    });
                            }}>
                                Definition
                            </Button><br />

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
                                    toggleUsingEnglishVoicesOnly();
                                }}>
                                {!useEnglishVoicesOnly ? "Use English Voices Only" : "Use All Voices"}
                            </Button><br />
                            <Button variant="contained" style={buttonStyle2}
                                onClick={() => {
                                    nextVoice();
                                }}>Next Voice</Button><br />
                            <Button variant="contained" style={buttonStyle2}
                                onClick={() => {
                                    prevVoice();
                                }}>Prev Voice</Button><br />

                            {(currentVoiceIndex != null ? currentVoiceIndex + 1 : '')}/{voices?.length} {voices[currentVoiceIndex]?.name?.replace('Online (Natural)', '').replace('Microsoft', '')}
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
