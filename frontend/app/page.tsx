'use client'
import { useEffect, useState } from 'react';
import './page.css'
import axios from 'axios';

export default function Home() {
  const [selectedSentences, setSelection] = useState<Array<String>>([]);
  const [sentences, setSentences] = useState<Array<Object>>([]);

  useEffect(() => {
    fetchSentences()
      .then((res: any) => setSentences(res.data))
      .catch((e: Error) => console.log(e));
  }, []);


  const isSentenceSelected = (id: String) => {
    return selectedSentences.includes(id);
  }

  const filterSelection = (id: String) => {
    return selectedSentences.filter(sentence => sentence !== id);
  }

  const onSentenceSelection = (id: String) => {
    if (isSentenceSelected(id)) {
      setSelection(filterSelection(id));
    } else {
      setSelection([...selectedSentences, id]);
    }
  }

  const onSubmit = () => {
    sendNotification();
  }

  const fetchSentences = async () => {
    try {
      const res = await axios.get(
        'http://localhost:5000/sentences'
      );
      console.log("Response", res);
      return {
        data: res.data
      };
    } catch (error) {
      console.log(error);
    }
  };

  const sendNotification = async () => {
    try {
      const data = {
        words: sentences.filter((item: any) => selectedSentences.includes(item.id))
      }
      const res = await axios.post(
        'http://localhost:5000/notify',
        data
      );
      console.log("Response ", res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <table>
        <thead>
          <tr>
            <th>Action</th>
            <th>Word</th>
            <th>Sentence</th>
          </tr>
        </thead>
        <tbody>
          {
            sentences.map((sentence: any) =>
              <tr key={sentence.id}>
                <td>
                  <input type="checkbox" value={sentence.id} name={`${sentence.id}_${sentence.title}`} checked={isSentenceSelected(sentence.id)}
                    onChange={() => onSentenceSelection(sentence.id)} />
                </td>
                <td>
                  <label>{sentence.title}</label>
                </td>
                <td>
                  <span>{sentence.description}</span>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
      <input className='p-5' type='button' name='submit' value="Submit" onClick={onSubmit} />
    </main>
  )
}
