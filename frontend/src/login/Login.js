import React, {useState} from "react"
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

const Login = ({handleSubmit}) => {
    const [teamCode, setTeamCode] = useState("")

    // const handleSubmit = (evt) => {
    //     evt.preventDefault()
    //     console.log(teamCode)
    // }

    return (
        <div>
            <form className="test" noValidate autoComplete="off" onSubmit={() => handleSubmit(teamCode)}>
                <label>Team code</label>
                <input type="text" data-test="team-code" value={teamCode} onChange={e => setTeamCode(e.target.value)}/>

                <input type="submit" value="Log In" data-test="submit"/>
            </form>
        </div>
    )
}

export default Login