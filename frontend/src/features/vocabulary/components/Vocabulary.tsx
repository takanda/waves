import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/store/hooks";
import styles from "../styles/Vocabulary.module.css";
import { fetchAsyncPartOfSpeech } from "../../../redux/modules/parts_of_speech";
import Sidebar from "./Sidebar";
import Contents from "./Contents";
import Button from "./Button";


const Vocabulary = () => {
  const isLoading = useAppSelector((state) => state.partsOfSpeech.isLoading);
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
      <Button />
    </div>
  );
};
export default Vocabulary