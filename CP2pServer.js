/*jslint node: true */
"use strict";

/**
 *	@require	module: *
 */
const _crypto			= require( 'crypto' );

const CP2pDriver		= require( './driver/CP2pDriver.js' );
const CP2pPackage		= require( './CP2pPackage.js' );
const CP2pDeliver		= require( './CP2pDeliver.js' );
const _p2pUtils			= require( './CP2pUtils.js' );

const _p2pConstants		= require( './p2pConstants.js' );
const _p2pLog			= require( './CP2pLog.js' );





/**
 *	p2p server
 *
 *	@module	CP2pServer
 *	@class	CP2pServer
 */
class CP2pServer extends CP2pDeliver
{
	/**
	 *	@constructor
	 *	@param oOptions
	 */
	constructor( oOptions )
	{
		super();

		this.m_oOptions			= Object.assign( {}, oOptions );
		this.m_cDriverServer		= CP2pDriver.createInstance( 'server', oOptions );
		super.cDriver			= this.m_cDriverServer;

		//	...
		this._init();
	}


	/**
	 * 	start server
	 *
	 *	@private
	 *	@returns {Promise<void>}
	 */
	async startServer()
	{
		setImmediate
		(
			() =>
			{
				this.m_cDriverServer.startServer();
			}
		);
	}

	/**
	 *	@public
	 *	@returns {Array}
	 */
	getClients()
	{
		return this.m_cDriverServer.getClients();
	}


	/**
	 *	initialize
	 *	@private
	 */
	async _init()
	{
		//
		//	hook events for server
		//
		this.m_cDriverServer
		.on( CP2pDriver.EVENT_START, ( oSocket, sInfo ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received [${ CP2pDriver.EVENT_START }].`, sInfo );
		})
		.on( CP2pDriver.EVENT_CONNECTION, ( oSocket ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received [${ CP2pDriver.EVENT_CONNECTION }].` );
		})
		.on( CP2pDriver.EVENT_MESSAGE, ( oSocket, sMessage ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received message [${ sMessage }].` );
			this._onMessage( oSocket, sMessage );
		})
		.on( CP2pDriver.EVENT_CLOSE, ( oSocket ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received a message [${ CP2pDriver.EVENT_CLOSE }].` );
		})
		.on( CP2pDriver.EVENT_ERROR, ( vError ) =>
		{
			_p2pLog.info( `* ${ this.constructor.name } Received a message [${ CP2pDriver.EVENT_ERROR }].` );
		});
	}

	_onMessage( oSocket, sMessage )
	{
		if ( ! _p2pUtils.isObject( oSocket ) )
		{
			_p2pLog.info( `call _onMessage with invalid parameter oSocket.` );
			return false;
		}
		if ( ! _p2pUtils.isString( sMessage ) || 0 === sMessage.length )
		{
			_p2pLog.info( `call _onMessage with invalid parameter sMessage.` );
			return false;
		}

		let arrMessage;
		let sType;
		let oBody;

		try {
			arrMessage	= JSON.parse( sMessage );
			if ( Array.isArray( arrMessage ) && arrMessage.length > 1 )
			{
				sType	= arrMessage[ 0 ];
				oBody	= arrMessage[ 1 ];

				switch ( sType )
				{
					case 'pow/task' :
						this._onMessageTask( oSocket, oBody );
						break;
					case 'pow/submit' :
						this._onMessageSubmit( oSocket, oBody );
						break;
					default:
						_p2pLog.info( `invalid message type.` );
						break;
				}
			}
			else
			{
				_p2pLog.info( `invalid message format, please send me message with format : [ 'type', { body } ].` );
			}
		}
		catch( e )
		{
			_p2pLog.info( `occurred an exception while JSON.parse an invalid sMessage.`, e );
		}

		return true;
	}

	_onMessageTask( oSocket, oBody )
	{
		//
		//	[ "pow/task", {} ]
		//
		_p2pLog.info( `call _onMessageTask with body : `, oBody );

		let oResponse	=
		{
			"id": 1,
			"pow": "equihash",
			"params": {
				"version": 0,
				"roundNumber": 12,
				"nonce": 0,
				"prepubSeed": "00000000000000000015a0f5afb0006b9415bc781fa5ce78115a6d07d5a10010",
				"prepreCoinbase": "00000000000000000015a0f5afb0006b9415bc781fa5ce78115a6d07d5a1001000000000000000000015a0f5afb0006b9415bc781fa5ce78115a6d07d5a10010",
				"preFirstStableMCU": "00000000000000000015a0f5afb0006b9415bc781fa5ce78115a6d07d5a1001000000000000000000015a0f5afb0006b9415bc781fa5ce78115a6d07d5a10010",
				"pubkey": "122334555333",
				"difficulty": "07ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
				"filterList": ["", ""],
				"times": 0,
				"timeout": 0
			},
			"interrupt": false,
			"error": null
		};

		//	oSocket, nPackageType, sEvent, oBody
		return this.sendResponse
		(
			oSocket,
			CP2pPackage.PACKAGE_RESPONSE,
			'response',
			oResponse
		);
	}

	_onMessageSubmit( oSocket, oBody )
	{
		_p2pLog.info( `call _onMessageSubmit with body : `, oBody );

		//	oSocket, nPackageType, sEvent, oBody
		return this.sendResponse
		(
			oSocket,
			CP2pPackage.PACKAGE_RESPONSE,
			'response',
			{ 'result' : 'received' }
		);
	}


}




/**
 *	@exports
 *	@type {CP2pClient}
 */
module.exports	= CP2pServer;
