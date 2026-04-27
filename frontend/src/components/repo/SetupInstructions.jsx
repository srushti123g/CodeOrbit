import React from "react";
import "./repoDetail.css";

import { useAuth } from "../../authContext";

const SetupInstructions = ({ repo }) => {
    const { currentUser } = useAuth();

    return (
        <div className="setup-instructions">
            <h3>Quick Setup — if you’ve done this kind of thing before</h3>
            <div className="command-block">
                <h4>or create a new repository on the command line</h4>
                <pre>
                    <code>
                        echo "# {repo.name}" &gt;&gt; README.md{"\n"}
                        codeOrbit init --repoId {repo._id} --userId {currentUser ? currentUser : "<USER_ID>"}{"\n"}
                        codeOrbit add README.md{"\n"}
                        codeOrbit commit "first commit"{"\n"}
                        codeOrbit push
                    </code>
                </pre>
            </div>

            <div className="command-block">
                <h4>or push an existing repository from the command line</h4>
                <pre>
                    <code>
                        codeOrbit init --repoId {repo._id} --userId {currentUser ? currentUser : "<USER_ID>"}{"\n"}
                        codeOrbit add .{"\n"}
                        codeOrbit commit "Initial commit"{"\n"}
                        codeOrbit push
                    </code>
                </pre>
            </div>

            <div className="helper-text">
                <p>
                    <strong>Note:</strong> To use the <code>codeOrbit</code> command, run this once in your terminal:
                    <br />
                    <code>cd backend && npm link && cd ..</code>
                    <br />
                    <br />
                    Your Repository ID is: <code>{repo._id}</code>
                </p>
            </div>
        </div>
    );
};

export default SetupInstructions;
