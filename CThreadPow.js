/*jslint node: true */
"use strict";

const EventEmitter		= require( 'events' );

const CP2pPackage		= require( 'trustp2p/CP2pPackage.js' );
const _p2pConstants		= require( 'trustp2p/p2pConstants.js' );
const _p2pUtils			= require( 'trustp2p/CP2pUtils.js' );


/**
 * 	@constant
 */
const MESSAGE_POW_TASK			= 'pow/task';
const MESSAGE_POW_TASK_RESPONSE		= 'pow/task_response';
const MESSAGE_POW_SUBMIT		= 'pow/submit';
const MESSAGE_POW_SUBMIT_RESPONSE	= 'pow/submit_response';





/**
 *	pow thread
 *
 *	@class	CThreadPow
 *
 *	@description
 *
 */
class CThreadPow extends EventEmitter
{
	/**
	 * 	@constructor
	 *
	 * 	@public
	 * 	@param	{object}	oNode
	 * 	@param	{object}	oNode.client	null or undefined if this is not a client instance
	 * 	@param	{object}	oNode.server	null or undefined if this is not a server instance
	 * 	@param	{object}	oNode.log
	 * 	@return	{void}
	 */
	constructor( oNode )
	{
		super();

		if ( ! _p2pUtils.isObject( oNode ) )
		{
			throw new Error( `constructor ${ this.constructor.name } with an invalid parameter oNode.` );
		}

		this.m_oNode			= oNode;
	}


	/**
	 *	events/handler map
	 *
	 * 	@public
	 *	@return {object}
	 */
	get eventMap()
	{
		return {
			[ CP2pPackage.PACKAGE_PING ]	:
				{
					[ MESSAGE_POW_TASK ]	: this._handleMessagePowTask,	//	ping by server
					[ MESSAGE_POW_SUBMIT ]	: this._handleMessagePowSubmit,		//	ping by server
				}
		}
	}

	/**
	 * 	start for this thread
	 * 	@public
	 */
	start()
	{
		this.m_oNode.log.info( `> ${ this.constructor.name } start was executed.` );
	}

	/**
	 * 	stop for this thread
	 * 	@public
	 */
	stop()
	{
		this.m_oNode.log.info( `> ${ this.constructor.name } stop was executed.` );
	}


	/**
	 *	callee for listening event about a new client connected in
	 *
	 * 	@public
	 *	@param oSocket
	 */
	onSocketConnection( oSocket )
	{
		this.m_oNode.log.info( `> ${ this.constructor.name } a new client connected in.` );
	}

	/**
	 *	callee for listening event about a outbound connection was opened
	 *
	 * 	@public
	 *	@param oSocket
	 */
	onSocketOpen( oSocket )
	{
		this.m_oNode.log.info( `> ${ this.constructor.name } a new outbound connection was opened.` );
	}

	/**
	 *	callee for listening event about a socket was closed
	 *
	 * 	@public
	 *	@param oSocket
	 */
	onSocketClose( oSocket )
	{
		this.m_oNode.log.info( `> ${ this.constructor.name } received a close message about socket.` );
	}

	/**
	 *	callee for listening event about error of a socket
	 *
	 * 	@public
	 *	@param vError
	 */
	onSocketError( vError )
	{
		this.m_oNode.log.info( `> ${ this.constructor.name } received a error message about socket.` );
	}



	/**
	 *	received ping message coming from server
	 *
	 *	@public
	 *	@param	{object}	oSocket
	 *	@param	{object}	objMessage
	 *	@return	{boolean}
	 */
	_handleMessagePowTask( oSocket, objMessage )
	{
		//
		//	respond a pong message
		//
		return this.m_oNode.client.sendResponse
		(
			oSocket,
			CP2pPackage.PACKAGE_RESPONSE,
			MESSAGE_POW_TASK_RESPONSE,
			{}
		);
	}

	_handleMessagePowSubmit( oSocket, objMessage )
	{
		//
		//	respond a pong message
		//
		return this.m_oNode.client.sendResponse
		(
			oSocket,
			CP2pPackage.PACKAGE_RESPONSE,
			MESSAGE_POW_SUBMIT_RESPONSE,
			{}
		);
	}

}






/**
 *	@exports	CThreadPow
 */
module.exports	= CThreadPow;








