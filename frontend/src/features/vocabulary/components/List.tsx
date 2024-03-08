import React, { useEffect, useState } from 'react'
import { useAppSelector, useAppDispatch } from '../../../redux/store/hooks';
import ReactPaginate from 'react-paginate';
import styles from "../styles/List.module.css";
import { setIsVisibleVocabularies, fetchAsyncVocabulary, fetchAsyncVocabularyList } from '../../../redux/modules/vocabulary';


const List = () => {
  const entries = useAppSelector((state) => state.vocabulary.entries);
  const dispatch = useAppDispatch();
  const [entryOffset, setEntryOffset] = useState(0);
  const itemsPerPage = 50;

  const endOffset = entryOffset + itemsPerPage;
  const currentEntries = entries.slice(entryOffset, endOffset);
  const pageCount = Math.ceil(entries.length / itemsPerPage);

  useEffect(() => {
    dispatch(fetchAsyncVocabularyList());
  }, [dispatch]);

  const handleUpdateClick = (entry: string) => {
    dispatch(fetchAsyncVocabulary(entry));
    dispatch(setIsVisibleVocabularies(false));
  };
  const handlePageClick: (selectedItem: { selected: number }) => void = (e) => {
    const newOffset = (e.selected * itemsPerPage) % entries.length;
    setEntryOffset(newOffset);
  };

  return (
    <>
      {entries.length > 0 ? (
        <>
          <div className={styles.vocabularies}>
            {currentEntries.map(entry => (
              <div key={entry} className={styles.vocabulary}>
                <button aria-label={entry} onClick={() => handleUpdateClick(entry)}>{entry}</button>
              </div>
            ))}
          </div>
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
        </>
      ) : (
        <h3>データがありません</h3>
      )}
    </>
  )
}

export default List
