/*jslint node: true */
"use strict";

/**
 *	@require	module: *
 */
const CP2pDriver		= require( './driver/CP2pDriver.js' );
const CP2pPackage		= require( './CP2pPackage.js' );
const CP2pDeliver		= require( './CP2pDeliver.js' );
const CThreadBootstrap		= require( './CThreadBootstrap.js' );

const _p2pConstants		= require( './p2pConstants.js' );
const _p2pLog			= require( './CP2pLog.js' );





/**
 *	p2p client
 *
 *	@module	CP2pClient
 *	@class	CP2pClient
 */
class CP2pClient extends CP2pDeliver
{
	/**
	 *	@constructor
	 *	@param oOptions
	 */
	constructor( oOptions )
	{
		super();

		/**
		 *	create client instance
		 */
		this.m_oOptions			= Object.assign( {}, oOptions );
		this.m_cDriverClient		= CP2pDriver.createInstance( 'client', oOptions );
		super.cDriver			= this.m_cDriverClient;

		//
		this._init();
	}


	/**
	 * 	make client connected to server
	 *
	 *	@private
	 *	@returns {Promise<void>}
	 */
	async startClient()
	{
		setImmediate( () =>
		{
			this.m_cDriverClient.connectToServer( this.m_oOptions.sHub );
		});
	}


	/**
	 * 	initialize
	 *	@private
	 */
	async _init()
	{
		//
		//	events for client
		//
		this.m_cDriverClient
		.on( CP2pDriver.EVENT_OPEN, ( oSocket ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received [${ CP2pDriver.EVENT_OPEN }], connect to server successfully.` );

			//
			//	send our version information to server peer
			//
			//this.sendVersion( oSocket );

			this.sendComputeMiner();
		})
		.on( CP2pDriver.EVENT_MESSAGE, ( oSocket, sMessage ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received ${ CP2pDriver.EVENT_MESSAGE } :: ${ sMessage }` );
		})
		.on( CP2pDriver.EVENT_CLOSE, ( oSocket ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received [${ CP2pDriver.EVENT_CLOSE }].` );

			//
			//	handle a socket was closed
			//
			this.handleClosed( oSocket );
		})
		.on( CP2pDriver.EVENT_ERROR, ( vError ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received [${ CP2pDriver.EVENT_ERROR }].` );
		});
	}


	//	...
	sendComputeMiner( oSocket )
	{
		//
		//	pubSeed	hex string 128 chars, 256, 64字节
		//
		let jsonBody = {
			id:1,
			pow:"equihash",
			"params": {
				version:0,
				roundNumber:14,
				nonce:0,
				pubSeed:"00000000000000000015a0f5afb0006b9415bc781fa5ce78115a6d07d5a10010",
				pubKey:"NBEFJ3LKG2SBSBK7D7GCFREOAFMS7QTQ",
				difficulty:111,
				filterList:[],
				times:0,
				timeout:0
			},
			interrupt:0,
			error:null
		};

		this.sendRequest
		(
			this,
			oSocket,
			CP2pPackage.PACKAGE_REQUEST,
			'pow/task',
			JSON.stringify( jsonBody ),
			true,
			function( oInstance, oSocket, request, sResponse )
			{
				console.log( `response from Mining :`, request, sResponse );
			}
		);
	}
}




/**
 *	@exports
 *	@type {CP2pClient}
 */
module.exports	= CP2pClient;
