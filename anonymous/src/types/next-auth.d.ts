// here we creating additional/modify existing data types
//again modify /declare 'interface user' which directly solve the problem faced in the option.ts file where we used/declare callback function
import 'next-auth'

declare module 'next-auth'{
interface User{
_id?: string;
isVerified?: boolean;
isAcceptingMessages?: boolean;
username?: string
}
}