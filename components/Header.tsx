"use client";

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";

const Header = () => {
  const { user } = useUser();
  return (
    <div>
      {user && (
        <h1>
          {user?.firstName} {`'s`} Space
        </h1>
      )}

      {/** breadcrumbs */}

      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  );
};

export default Header;
