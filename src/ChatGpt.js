import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';

const ChatGpt = () => {
    const [token, setToken] = useState('');
    useEffect(() => {
        fetchToken();
    }, []);
    const authentication = {
      "username": "admin",
      "password": "LearningIsFun!"
    }
    const fetchToken = async () => {
      try {
        const tokenresponse = await axios.post('https://test.iris.health/api/token/',  authentication);
        setToken(tokenresponse.data)
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const [problem, setSelectedProblem] = useState('');
    const handleProblem = (event) => {
        setSelectedProblem(event.target.value);
    };

    const options = ['psychometric', 'pyschosocial'];
    const [selectedOption, setSelectedOption] = useState('');
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };
    
    
    const [botdata1, setBotdata1] = useState([]);
    const [botdata2, setBotdata2] = useState([]);
    const tok = {token:token.access}
    localStorage.setItem('token',tok.token)
    const [uniqueId,setUid] = useState('');
    useEffect(() => {
        setUid(uuidv4);
    }, [])
    localStorage.setItem('uid',uniqueId)
    const senddata1 = {
        "sender": uniqueId,
        "message": "/faq",
        "metadata": {
            "token": tok.token,
            "slots": {
                "translation_language": "en",
                "name": "Mahesh",
                "problem": problem,
                "gender": "Male",
                "age": "20",
                "city": "Bengaluru",
                "long": "Na",
                "services": "Na",
                "location": "Na",
                "weight": "Na",
                "height": "Na",
                "data": {
                    "use_case": selectedOption
                }
            }
        }
    }
    const senddata2 = {
        "sender": uniqueId,
        "message": "/faq",
        "metadata": {
            "token": tok.token,
            "slots": {
                "translation_language": "en",
                "name": "Mahesh",
                "problem": problem,
                "gender": "Male",
                "age": "20",
                "city": "Bengaluru",
                "long": "Na",
                "services": "Na",
                "location": "Na",
                "weight": "Na",
                "height": "Na",
                "data": {
                    "use_case": selectedOption
                }
            }
        }
    }
    const fetchData =  () => {
        try {
            axios.post('https://test.iris.health/bot/', senddata1).then(response => {
                setBotdata1(response.data);
                setTimeout(()=>fetchSecondApi(response.data),10000);
              })
              .catch(error => {
                console.error('Error fetching data:', error);
              });          
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
    const fetchSecondApi = (tmp) => {
        try{
            senddata2["metadata"]["slots"]["case_id"] = tmp[1].custom.case_id 
            localStorage.setItem('caseid',senddata2["metadata"]["slots"]["case_id"])
            axios.post('https://test.iris.health/bot/', senddata2).then(response1 => {
                const list = response1.data[0].buttons
                const symptom = []
                for (let i = 0; i < list.length; i++) {
                    symptom.push(list[i].title);
                }
                setBotdata2(symptom);
                localStorage.setItem('symptoms',symptom)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });    
        } catch (error) {
            console.error('Error fetching data:', error)
        }      
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        fetchData();
    };

    const [selectedItems, setSelectedItems] = useState([]);
    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setSelectedItems((prevSelectedItems) =>
        prevSelectedItems.includes(value)
            ? prevSelectedItems.filter((item) => item !== value)
            : [...prevSelectedItems, value]
        );
    };
    const [botdata3,setBotdata3] = useState([]);
    const [res, setRes] = useState([]);
    const handleCaseData = () => {
        localStorage.setItem('data',selectedItems);
        localStorage.setItem('pblm',problem)
        localStorage.setItem('selectedoption',selectedOption)

        const selectedItems1 = localStorage.getItem("data");
        const caseid = localStorage.getItem("caseid")
        const problem1 = localStorage.getItem("pblm")
        const selectedOption1 = localStorage.getItem("selectedoption")

        const token = localStorage.getItem('token')
        const tok = {token:token}

        const uid = localStorage.getItem('uid')

        const symptom = localStorage.getItem('symptoms')
        
        const selected = selectedItems1.split(',')
        const symptomArray = symptom.split(',')
        const notselected = symptomArray.filter(function(x) { 
            return selected.indexOf(x) < 0;
        });
        const ar1 = JSON.stringify(selected);
        const ar2 = JSON.stringify(notselected);
        const msg = JSON.stringify({"selected": ar1,"not_selected": ar2})
        const senddata = {
            "sender": uid,
            "message": msg,
            "metadata": {
                "token": tok.token,
                "slots": {
                    "translation_language": "en",
                    "name": "Mahesh",
                    "problem": problem1,
                    "gender": "Male",
                    "age": "20",
                    "city": "Bengaluru",
                    "long": "Na",
                    "services": "Na",
                    "location": "Na",
                    "weight": "Na",
                    "height": "Na",
                    "data": {
                        "use_case": selectedOption1
                    },
                    "case_id": parseInt(caseid)
                }
            }
        }
        try {
            axios.post('https://test.iris.health/bot/', senddata).then(response => {
                setBotdata3(response.data)
                setTimeout(fetchSecondApi1, 15000);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            }); 
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        const fetchSecondApi1 = () => {
            try{
                const headers = {
                    Authorization: `Bearer ${token}`,
                };
                const fcaseid = caseid
                const url = `https://test.iris.health/data/cases/${fcaseid}`
                axios.get(url, {headers}).then(response5 => {
                    setRes(response5.data)
                })
                .catch(error => {
                    console.error('Error fetching data:', error);
                });
            } catch (error){
                console.error('Error getching data:', error)
            }
        }
    }
    console.log(res)

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1>Symptom Application</h1>
                <input type='text' placeholder='Enter problem' onChange={handleProblem}/>
                <br></br>
                <br></br>
                <select value={selectedOption} onChange={handleOptionChange}>
                    <option value="">Select path</option>
                    {options.map((option) => (
                        <option key={option} value={option}>
                        {option}
                        </option>
                    ))}
                </select>
                <button style={{'marginLeft':'10px'}}>submit</button>
            </form>

            {botdata2.map((item, index) => (
                <div key={index}>
                    <label>
                    <input
                        type="checkbox"
                        value={item}
                        checked={selectedItems.includes(item)}
                        onChange={handleCheckboxChange}
                    />
                    {item}
                    </label>
                </div>
            ))}
            {selectedItems.length>0 && (
                <button onClick={handleCaseData}>Getdata</button>
            )}
        </div>
    )
}

export default ChatGpt