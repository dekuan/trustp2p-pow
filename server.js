'use strict';

const CP2pClient 	= require( './CP2pClient.js' );
const CP2pServer 	= require( './CP2pServer.js' );


const oOptions	={
	nPort			: 1108,
};
const p2pServer	= new CP2pServer( oOptions );
p2pServer.startServer();
