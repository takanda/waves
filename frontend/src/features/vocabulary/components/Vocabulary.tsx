import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/store/hooks";
import styles from "../styles/Vocabulary.module.css";
import { fetchAsyncPartOfSpeech } from "../../../redux/modules/parts_of_speech";
import Sidebar from "./Sidebar";
import Contents from "./Contents";
import Footer from "./Button";


const Vocabulary = () => {
  const isLoading = useAppSelector((state) => state.partsOfSpeech.isLoading);
  const isVisibleVocabularies = useAppSelector((state) => state.vocabulary.isVisibleVocabularies);
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
      <Contents />
    </div>
  );
};
export default Vocabulary