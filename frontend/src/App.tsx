import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "./redux/store/hooks";
import styles from "./App.module.css";
import { fetchAsyncPartOfSpeech } from "./redux/modules/parts_of_speech";
import Sidebar from "./components/Sidebar";
import List from "./components/List";
import Input from "./components/Input";
import Button from "./components/Button";


const App = () => {
  const isLoading = useAppSelector((state) => state.partsOfSpeech.isLoading);
  const showVocabularyList = useAppSelector((state) => state.vocabulary.showVocabularyList);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAsyncPartOfSpeech())
  }, [dispatch])

  if (isLoading) {
    return <></>;
  }
  return (
    <div className={styles.app}>
      <Sidebar />
      {showVocabularyList ? (
        <List />
      ) : (
        <Input />
      )}
      <Button />
    </div>
  );
};
export default App