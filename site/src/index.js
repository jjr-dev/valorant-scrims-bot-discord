const VAPI_URL = "https://valorant-api.com";

function getAgents() {
    return new Promise((resolve, reject) => {
        fetch(`${VAPI_URL}/v1/agents?language=pt-BR&isPlayableCharacter=true`)
            .then(async (response) => {
                if(response.status === 200) {
                    const json = await response.json();

                    resolve(json);
                } else {
                    reject(response);   
                }
            })
            .catch((err) => reject(err))
    })
}

async function loadPage() {
    const agents = await getAgents();

    if(agents.status == 200) {
        const agent = agents.data[Math.floor(Math.random() * agents.data.length)];

        console.log(agent);
        
        const agent_image = document.querySelector('.header #agent-image');
        agent_image.src = agent.fullPortrait;
        agent_image.alt = agent.displayName;

        const agent_background = document.querySelector('.header #agent-background');
        agent_background.src = agent.background;
    }
}

loadPage();