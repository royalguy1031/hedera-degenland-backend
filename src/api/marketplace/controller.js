const { transferNFT } = require('../chainAction');

const Marketplace = require('../../models/Marketplace');
const SoldNftList = require('../../models/SoldNftList');
const Account = require('../../models/Account');

exports.getItemDetail = async (req_, res_) => {
    try {
        if (!req_.query.id)
            return res_.send({ result: false, error: 'failed' });
        const _id = req_.query.id;
        const _nftInfo = await Marketplace.findOne({ _id: _id });
        return res_.send({ result: true,  data: _nftInfo });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.checkNft = async (req_, res_) => {
    try {
        if (!req_.query.token_id || !req_.query.serial_number)
            return res_.send({ result: false, error: 'failed' });
        const _tokenId = req_.query.token_id;
        const _serialNumber = req_.query.serial_number;
        const _nftInfo = await Marketplace.findOne({ token_id: _tokenId, serial_number: _serialNumber });
        if (!_nftInfo)
            return res_.send({ result: true,  data: { status: false } });
        return res_.send({ result: true,  data: { status: true, id: _nftInfo._id } });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getList = async (req_, res_) => {
    try {
        const _nftList = await Marketplace.find({});
        return res_.send({ result: true,  data: _nftList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.getListByAccountId = async (req_, res_) => {
    try {
        if (!req_.query.accountId)
            return res_.send({ result: false, error: 'failed' });
        const _accountId = req_.query.accountId;
        const _nftList = await Marketplace.find({ owner_accountid: _accountId });
        return res_.send({ result: true,  data: _nftList });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.setList = async (req_, res_) => {
    try {
        if (!req_.body.owner_accountid || !req_.body.token_id || !req_.body.serial_number || !req_.body.price || !req_.body.name || !req_.body.creator || !req_.body.imageUrl)
            return res_.send({ result: false, error: 'failed' });
        const _ownerAccountId = req_.body.owner_accountid;
        const _tokenId = req_.body.token_id;
        const _serialNumber = req_.body.serial_number;
        const _price = req_.body.price;
        const _name = req_.body.name;
        const _creator = req_.body.creator;
        const _imageUrl = req_.body.imageUrl;

        // Get playerid
        const _ownerInfo = await Account.findOne({ accountId: _ownerAccountId });
        if (!_ownerInfo)
            return res_.send({ result: false, error: 'Unregistered account!' });

        const newNftList = new Marketplace({
            owner_accountid: _ownerAccountId,
            owner_playerid: _ownerInfo.playerId,
            token_id: _tokenId,
            serial_number: _serialNumber,
            price: _price,
            name: _name,
            creator: _creator,
            imageUrl: _imageUrl
        });
        await newNftList.save();

        return res_.send({ result: true,  msg: 'success! Your NFT has been listed!' });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.cancelList = async (req_, res_) => {
    try {
        if (!req_.body.token_id || !req_.body.serial_number)
            return res_.send({ result: false, error: 'failed' });
        const _tokenId = req_.body.token_id;
        const _serialNumber = req_.body.serial_number;

        const _result = await Marketplace.findOneAndDelete({ token_id: _tokenId, serial_number: _serialNumber });
        if (!_result)
            return res_.send({ result: false, error: "Error detected in server progress!" });
        return res_.send({ result: true,  msg: 'success! Your NFT has been listed!' });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.setFavourites = async (req_, res_) => {
    try {
        if (!req_.body.id || !req_.body.accountId)
            return res_.send({ result: false, error: 'failed' });
        const id = req_.body.id;
        const _accountId = req_.body.accountId;

        const _oldNftInfo = await Marketplace.findOne({ _id: id });
        _oldNftInfo.favouritesList.push(_accountId);

        const _newNftInfo = await Marketplace.findOneAndUpdate(
            { _id: id },
            {
                favourites: _oldNftInfo.favourites + 1,
                favouritesList: _oldNftInfo.favouritesList
            },
            { new: true }
        );
        return res_.send({ result: true, data: _newNftInfo});
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.unsetFavourites = async (req_, res_) => {
    try {
        if (!req_.body.id || !req_.body.accountId)
            return res_.send({ result: false, error: 'failed' });
        const id = req_.body.id;
        const _accountId = req_.body.accountId;

        const _oldNftInfo = await Marketplace.findOne({ _id: id });
        for (let i = 0;i < _oldNftInfo.favouritesList.length;i++) {
            if (_oldNftInfo.favouritesList[i] == _accountId)
                _oldNftInfo.favouritesList.splice(i, 1);
        }

        const _newNftInfo = await Marketplace.findOneAndUpdate(
            { _id: id },
            {
                favourites: _oldNftInfo.favourites - 1,
                favouritesList: _oldNftInfo.favouritesList
            },
            { new: true }
        );
        return res_.send({ result: true, data: _newNftInfo});
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.setWatching = async (req_, res_) => {
    try {
        if (!req_.body.id || !req_.body.accountId)
            return res_.send({ result: false, error: 'failed' });
        const id = req_.body.id;
        const _accountId = req_.body.accountId;

        const _oldNftInfo = await Marketplace.findOne({ _id: id });
        _oldNftInfo.watchingList.push(_accountId);

        const _newNftInfo = await Marketplace.findOneAndUpdate(
            { _id: id },
            {
                watching: _oldNftInfo.watching + 1,
                watchingList: _oldNftInfo.watchingList
            },
            { new: true }
        );
        return res_.send({ result: true, data: _newNftInfo});
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.unsetWatching = async (req_, res_) => {
    try {
        if (!req_.body.id || !req_.body.accountId)
            return res_.send({ result: false, error: 'failed' });
        const id = req_.body.id;
        const _accountId = req_.body.accountId;

        const _oldNftInfo = await Marketplace.findOne({ _id: id });
        for (let i = 0;i < _oldNftInfo.watchingList.length;i++) {
            if (_oldNftInfo.watchingList[i] == _accountId)
                _oldNftInfo.watchingList.splice(i, 1);
        }

        const _newNftInfo = await Marketplace.findOneAndUpdate(
            { _id: id },
            {
                watching: _oldNftInfo.watching - 1,
                watchingList: _oldNftInfo.watchingList
            },
            { new: true }
        );
        return res_.send({ result: true, data: _newNftInfo});
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}

exports.sendNft = async (req_, res_) => {
    try {
        if (!req_.body.a || !req_.body.b || !req_.body.c)
            return res_.send({ result: false, error: 'failed' });

        const _nftInfo = {
            token_id: atob(req_.body.a.token_id),
            serial_number: atob(req_.body.a.serial_number),
        };
        const _sellerId = atob(req_.body.b);
        const _buyerId = atob(req_.body.c);
        const _soldPrice = atob(req_.body.d);

        const claimResult = await transferNFT(_sellerId, _buyerId, _nftInfo);
        const _checkSoldNftListRes = await SoldNftList.findOne({ token_id: _nftInfo.token_id, serial_number: _nftInfo.serial_number, success: false });
        let _newSoldNftList;
        if (!_checkSoldNftListRes) {
            const _detailInfo = await Marketplace.findOne({ token_id: _nftInfo.token_id, serial_number: _nftInfo.serial_number });
            const _buyerInfo = await Account.findOne({ accountId: _buyerId });
            _newSoldNftList = new SoldNftList({
                token_id: _detailInfo.token_id,
                serial_number: _detailInfo.serial_number,
                imageUrl: _detailInfo.imageUrl,
                name: _detailInfo.name,
                totalAmount: _soldPrice,
                buyer: _buyerInfo.playerId,
                seller: _detailInfo.owner_playerid,
                success: claimResult
            });
            await _newSoldNftList.save();
        }
        if (!claimResult)
            return res_.send({ result: false, error: "Error! The transaction was rejected, or failed! Please try again!" });
        // add sold nft list
        await SoldNftList.findOneAndUpdate(
            { _id: _newSoldNftList._id },
            { success: true }
        );
        // delete nft in list
        const _result = await Marketplace.findOneAndDelete({ token_id: _nftInfo.token_id, serial_number: _nftInfo.serial_number });
        if (!_result)
            return res_.send({ result: false, error: "Error detected in server progress!" });
        return res_.send({ result: true, data: "success!" });
    } catch (error) {
        return res_.send({ result: false, error: 'Error detected in server progress!' });
    }
}