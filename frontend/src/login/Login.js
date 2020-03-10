import React, {useState} from "react"
import '../css/Login.css';

const Login = ({handleSubmit}) => {
    const [teamCode, setTeamCode] = useState(156077)

    return (
        <div className="login-form">
            <form className="login-form" noValidate autoComplete="off" onSubmit={(event) => { 
                    event.preventDefault()
                    handleSubmit(teamCode)
                    }
                }>
                <label>Team code </label>
                <input type="text" data-test="team-code" value={teamCode} onChange={e => setTeamCode(e.target.value)}/>

                <input type="submit" value="Log In" data-test="submit"/>
            </form>
        </div>
    )
}

export default Login
