import {Avatar, Tooltip} from "@mantine/core";
import {useState, useEffect} from 'react';

export default function NestedUsersAvatar({users, maxAvatarDisplayed = 3}) {
    const [displayedUsers, setDisplayedUsers] = useState([]);

    useEffect(() => {
        console.log(users);
        setDisplayedUsers(users?.slice(0, maxAvatarDisplayed));
    }, [users, maxAvatarDisplayed]);


    return (
        <Tooltip.Group openDelay={300} closeDelay={100}>
            <Avatar.Group spacing="sm">
                {displayedUsers.map((user, index) => (
                    <Tooltip key={index} label={user.username} withArrow>
                        <Avatar src={'https://picsum.photos/200/300'} radius="xl">
                            {Array.isArray(user.username) ? '+' + (user.username.length - 1) : ''}
                        </Avatar>
                    </Tooltip>
                ))}

                {users.length - displayedUsers.length > 0 && (
                <Tooltip withArrow
                         label={
                             <>
                                 {users.slice(maxAvatarDisplayed).map((user, index) => (
                                     <div key={index}>{user.username}</div>
                                 ))}
                             </>
                         }
                >
                    <Avatar radius="xl">+{users.length - displayedUsers.length}</Avatar>
                </Tooltip>
                )}
            </Avatar.Group>
        </Tooltip.Group>
    );
}