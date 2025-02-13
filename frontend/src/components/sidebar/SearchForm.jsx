import { Search } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import PropTypes from "prop-types";
import SmallLoader from "../Loader/SmallLoader";

const SearchForm = ({ searchForUsers, setSearchedUser }) => {
  const { isSearchingUsers, getUsers } = useChatStore();
  return (
    <form
      className="mt-3 w-full justify-between outline-none hidden lg:flex items-center border"
      onSubmit={searchForUsers}
    >
      <input
        type="text"
        disabled={isSearchingUsers}
        className="input outline-none w-full"
        placeholder="Search for users..."
        onChange={(e) => {
          setSearchedUser(e.target.value);
          if (e.target.value === "") getUsers();
        }}
      />
      <button className="btn btn-primary rounded-none">
        {isSearchingUsers ? (
          <>
            <SmallLoader />
          </>
        ) : (
          <Search />
        )}
      </button>
    </form>
  );
};

SearchForm.propTypes = {
  searchForUsers: PropTypes.func.isRequired,
  setSearchedUser: PropTypes.func.isRequired,
};
export default SearchForm;
