import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import ReactPaginate from 'react-paginate';
import styles from "../styles/List.module.css";
import { fetchAsyncVocabularyList } from '../../../redux/modules/vocabulary';
import Table from './Table';


const List = () => {
  const dictionaryEntries = useAppSelector((state) => state.vocabulary.dictionaryEntries);
  const dispatch = useAppDispatch();
  const [entryOffset, setEntryOffset] = useState(0);
  const itemsPerPage = 50;

  const endOffset = entryOffset + itemsPerPage;
  const currentDictionaryEntries = dictionaryEntries.slice(entryOffset, endOffset);
  const pageCount = Math.ceil(dictionaryEntries.length / itemsPerPage);

  useEffect(() => {
    dispatch(fetchAsyncVocabularyList());
  }, [dispatch]);


  const handlePageClick: (selectedItem: { selected: number }) => void = (e) => {
    const newOffset = (e.selected * itemsPerPage) % dictionaryEntries.length;
    setEntryOffset(newOffset);
  };

  return (
    <>
      {dictionaryEntries.length > 0 ? (
        <>
          <div className={styles.pagination}>
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={5}
              pageCount={pageCount}
              previousLabel="< previous"
              pageClassName="page-item"
              pageLinkClassName="page-link"
              previousClassName="page-item"
              previousLinkClassName="page-link"
              nextClassName="page-item"
              nextLinkClassName="page-link"
              breakClassName="page-item"
              breakLinkClassName="page-link"
              containerClassName="pagination"
              activeClassName="active"
              renderOnZeroPageCount={null}
            />
          </div>
          <Table currentDictionaryEntries={currentDictionaryEntries} />
        </>
      ) : (
        <h3>データがありません</h3>
      )}
    </>
  )
}

export default List
