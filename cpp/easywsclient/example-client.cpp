#include "easywsclient.hpp"
//#include "easywsclient.cpp" // <-- include only if you don't want compile separately

#include <assert.h>
#include <stdio.h>
#include <string>

using easywsclient::WebSocket;
static WebSocket::pointer ws = NULL;



void handle_message( const std::string & message )
{
	printf(">>> RECEIVED %s\n", message.c_str());
	if ( message == "world" )
	{
		ws->close();
	}
}


int main()
{
    ws = WebSocket::from_url( "ws://10.10.11.68:1108" );
    assert( ws );
    ws->send( "[\"pow/task\",{\"s\":111111,\"fff\":\"############################################################\"}]" );
    ws->send( "[\"pow/task\",{\"s\":222222,\"fff\":\"$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$\"}]" );

    while ( ws->getReadyState() != WebSocket::CLOSED )
    {
		ws->poll();
		ws->dispatch( handle_message );
    }
    delete ws;

    return 0;
}
