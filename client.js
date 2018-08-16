'use strict';

const CP2pClient 	= require( './CP2pClient.js' );


const oOptions	={
	nPort		: 1108,
	sHub		: 'ws://192.168.18.128:9000',
};
const p2pClient	= new CP2pClient( oOptions );
p2pClient.startClient();
