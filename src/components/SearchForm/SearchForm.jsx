import Button from '../Button/Button';
import { getAllUsers } from '../../api/db-service';
import './SearchForm.css';

function SearchForm() {
  return (
    <div className='search-bar'>
      <input
        type='text'
        className='search-bar__input'
        placeholder='Search...'
      />
      <Button
        className='search-bar__button secondary'
        onClickHandler={() => {
          getAllUsers();
        }}
      >
        Search
      </Button>
    </div>
  );
}

export default SearchForm;
