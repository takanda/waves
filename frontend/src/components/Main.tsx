import React, { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../redux/store/hooks";
import { fetchAsyncPartOfSpeech } from "../redux/modules/parts_of_speech";
import Contents from './Contents'
import Sidebar from './Sidebar'
import styles from '../styles/Main.module.css'

const Main = () => {
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
        </div>
    )
}

export default Main