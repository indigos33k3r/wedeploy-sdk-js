'use strict';

import GithubAuthProvider from '../../../src/api/auth/GithubAuthProvider';

describe('GithubAuthProvider', function() {
	it('should set provider to GithubAuthProvider.PROVIDER', function() {
		var provider = new GithubAuthProvider();
		assert.strictEqual(GithubAuthProvider.PROVIDER, provider.getProvider());
	});

	it('should make authorization url with provider', function() {
		var provider = new GithubAuthProvider();
		assert.strictEqual('/oauth/authorize?provider=github', provider.makeAuthorizationUrl());
	});
});