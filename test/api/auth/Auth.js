'use strict';

import Auth from '../../../src/api/auth/Auth';
import WeDeploy from '../../../src/api/WeDeploy';

describe('Auth', function() {

	afterEach(function() {
		RequestMock.teardown();
	});

	beforeEach(function() {
		RequestMock.setup();
	});

	it('should create Auth instance with a token', function() {
		var auth = Auth.create('My Token');
		assert.ok(auth.hasToken());
		assert.strictEqual('My Token', auth.token);
		assert.strictEqual('My Token', auth.getToken());
	});

	it('should create Auth instance with email and password', function() {
		var auth = Auth.create('email', 'password');
		assert.ok(auth.hasEmail());
		assert.ok(auth.hasPassword());
		assert.strictEqual('email', auth.email);
		assert.strictEqual('email', auth.getEmail());
		assert.strictEqual('password', auth.password);
		assert.strictEqual('password', auth.getPassword());
	});

	it('should create Auth instance and set other fields', function() {
		var auth = Auth.create();
		auth.setCreatedAt('createdAt');
		auth.setId('id');
		auth.setName('name');
		auth.setPassword('password');
		auth.setPhotoUrl('photoUrl');
		assert.ok(auth.hasCreatedAt());
		assert.ok(auth.hasId());
		assert.ok(auth.hasName());
		assert.ok(auth.hasPassword());
		assert.ok(auth.hasPhotoUrl());
		assert.strictEqual('createdAt', auth.createdAt);
		assert.strictEqual('id', auth.id);
		assert.strictEqual('name', auth.name);
		assert.strictEqual('password', auth.password);
		assert.strictEqual('photoUrl', auth.photoUrl);
		assert.strictEqual('createdAt', auth.getCreatedAt());
		assert.strictEqual('id', auth.getId());
		assert.strictEqual('name', auth.getName());
		assert.strictEqual('password', auth.getPassword());
		assert.strictEqual('photoUrl', auth.getPhotoUrl());
	});

	it('should throws exception when calling updateUser without data', function() {
		var auth = Auth.create();
		auth.setWedeployClient(WeDeploy);
		assert.throws(() => auth.updateUser(), Error);
	});

	it('should throws exception when calling updateUser without data', function() {
		var auth = Auth.create();
		auth.setWedeployClient(WeDeploy);
		assert.throws(() => auth.updateUser(), Error);
	});

	it('should call updateUser successfully', function(done) {
		var auth = Auth.create();
		auth.setWedeployClient(WeDeploy);
		RequestMock.intercept().reply(200);
		auth
			.updateUser({})
			.then(() => done());
	});

	it('should call updateUser unsuccessfully', function(done) {
		var auth = Auth.create();
		auth.setWedeployClient(WeDeploy);
		RequestMock.intercept().reply(400);
		auth
			.updateUser({})
			.catch(() => done());
	});

	it('should call updateUser unsuccessfully with error response as reason', function(done) {
		var auth = Auth.create();
		auth.setWedeployClient(WeDeploy);
		auth.currentUser = {};
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.updateUser({})
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});

	it('should throws exception when calling deleteUser without user having id', function() {
		var auth = Auth.create();
		auth.setWedeployClient(WeDeploy);
		assert.throws(() => auth.deleteUser(), Error);
	});

	it('should call deleteUser successfully', function(done) {
		var auth = Auth.create();
		auth.setId('id');
		auth.setWedeployClient(WeDeploy);
		RequestMock.intercept().reply(200);
		auth
			.deleteUser()
			.then(() => done());
	});

	it('should call deleteUser unsuccessfully', function(done) {
		var auth = Auth.create();
		auth.setId('id');
		auth.setWedeployClient(WeDeploy);
		RequestMock.intercept().reply(400);
		auth
			.deleteUser()
			.catch(() => done());
	});

	it('should call deleteUser unsuccessfully with error response as reason', function(done) {
		var auth = Auth.create();
		auth.setId('id');
		auth.setWedeployClient(WeDeploy);
		var responseErrorObject = {
			error: true
		};
		RequestMock.intercept().reply(400, JSON.stringify(responseErrorObject), {
			'content-type': 'application/json'
		});
		auth
			.deleteUser()
			.catch((reason) => {
				assert.deepEqual(responseErrorObject, reason);
				done();
			});
	});
});