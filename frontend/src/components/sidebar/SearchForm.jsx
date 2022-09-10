import { Loader2, Search } from "lucide-react";
import { useChatStore } from "../../store/useChatStore";
import PropTypes from "prop-types";

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
            <Loader2 className="size-5 animate-spin font-bold" />
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
