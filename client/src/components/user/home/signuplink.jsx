import CopyToClipboard from "./copytoclipboard";

const SignUpLinks = ({username,side,userid}) => {
    var JoinLink = window.location.origin + "/signup/" + btoa(username + "|" + side + "|" + userid)
    return(
        <>
            {/* <div className="grid grid-cols-3 gap-2 bg-gold-100"> */}
                <div className="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
                    <a href="#">
                        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{side} Join Link</h5>
                    </a>
                    {/* <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 break-all">{JoinLink}</p> */}
                    <CopyToClipboard text={JoinLink}/>
                </div>
            {/* </div> */}
        </>
    );
}

export default SignUpLinks;