import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const SignOut = ({ loggedOut }) => {
    const history = useHistory();
    useEffect(() => {
        loggedOut(false);
        history.push('/');
    }, [loggedOut, history]);

    return (
        <>
            {/* Your component JSX goes here */}
        </>
    );
}

export default SignOut;
